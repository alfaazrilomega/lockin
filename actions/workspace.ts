'use server'

import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function getUserWorkspaces() {
  const user = await getUser()
  const userEmail = user.email ? user.email.toLowerCase() : ''

  // Automatically sync pending email invitations to current user's ID
  if (userEmail) {
    try {
      await prisma.$executeRaw`
        UPDATE public.hr_workspace_members
        SET user_id = ${user.id}::uuid
        WHERE LOWER(invited_email) = ${userEmail} AND user_id != ${user.id}::uuid
      `
    } catch (err) {
      console.error('Error syncing member invitation:', err)
    }
  }

  // Ensure current user ALWAYS has their own personal workspace
  let ownedWorkspace = await prisma.hRWorkspace.findFirst({
    where: { owner_id: user.id }
  })

  if (!ownedWorkspace) {
    let baseSlug = `ws-${user.id.slice(0, 8)}`
    let slug = baseSlug
    let counter = 1
    while (await prisma.hRWorkspace.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // ENSURE PROFILE EXISTS BEFORE CREATING WORKSPACE TO FIX FK CONSTRAINT
    await prisma.hRProfile.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'Unknown User'
      }
    })

    ownedWorkspace = await prisma.hRWorkspace.create({
      data: {
        name: `${user.email?.split('@')[0] || 'My'}'s Workspace`,
        slug,
        owner_id: user.id,
        members: {
          create: {
            user_id: user.id,
            role: 'owner',
            status: 'active'
          }
        }
      }
    })
  }

  // ONLY return workspaces where current user is OWNER or ACTIVE member!
  const workspaces = await prisma.hRWorkspace.findMany({
    where: {
      OR: [
        { owner_id: user.id },
        { members: { some: { status: 'active', OR: [{ user_id: user.id }, { invited_email: userEmail }] } } }
      ]
    },
    include: {
      members: true
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return workspaces.map(ws => {
    const isOwner = ws.owner_id === user.id
    const userMember = ws.members.find(m => m.user_id === user.id || (m.invited_email && m.invited_email.toLowerCase() === userEmail))
    const userRole: 'owner' | 'member' = isOwner ? 'owner' : (userMember?.role === 'owner' ? 'owner' : 'member')

    return {
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      owner_id: ws.owner_id,
      userRole
    }
  })
}

export async function getWorkspaceData(targetSlug?: string) {
  const user = await getUser()
  const userEmail = user.email ? user.email.toLowerCase() : ''

  // 1. Sync any invited member rows matching user.email to user.id
  if (userEmail) {
    try {
      await prisma.$executeRaw`
        UPDATE public.hr_workspace_members
        SET user_id = ${user.id}::uuid
        WHERE LOWER(invited_email) = ${userEmail} AND user_id != ${user.id}::uuid
      `
    } catch (err) {
      console.error('Error syncing member invitation:', err)
    }
  }

  // 2. GUARANTEE that current user ALWAYS has their own personal workspace
  let ownedWorkspace = await prisma.hRWorkspace.findFirst({
    where: { owner_id: user.id },
    include: {
      members: {
        include: { user: true }
      }
    }
  })

  if (!ownedWorkspace) {
    let baseSlug = `ws-${user.id.slice(0, 8)}`
    let slug = baseSlug
    let counter = 1
    while (await prisma.hRWorkspace.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // ENSURE PROFILE EXISTS BEFORE CREATING WORKSPACE TO FIX FK CONSTRAINT
    await prisma.hRProfile.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'Unknown User'
      }
    })

    ownedWorkspace = await prisma.hRWorkspace.create({
      data: {
        name: `${user.email?.split('@')[0] || 'My'}'s Workspace`,
        slug,
        owner_id: user.id,
        members: {
          create: {
            user_id: user.id,
            role: 'owner',
            status: 'active'
          }
        }
      },
      include: {
        members: {
          include: { user: true }
        }
      }
    })
  }

  let workspace = null

  if (targetSlug) {
    workspace = await prisma.hRWorkspace.findUnique({
      where: { slug: targetSlug },
      include: {
        members: {
          include: { user: true }
        }
      }
    })
  }

  // 3. Strict Validation: User can ONLY view target workspace if they are OWNER or ACTIVE member!
  if (workspace) {
    const isOwner = workspace.owner_id === user.id
    const isActiveMember = workspace.members.some(
      m => (m.user_id === user.id || (m.invited_email && m.invited_email.toLowerCase() === userEmail)) && m.status === 'active'
    )

    // If user is neither owner nor active member (e.g. pending invitation or unauthorized), fallback to owned workspace!
    if (!isOwner && !isActiveMember) {
      workspace = ownedWorkspace
    }
  } else {
    // Default workspace is ALWAYS user's owned workspace
    workspace = ownedWorkspace
  }

  // Determine current user's role in THIS SPECIFIC WORKSPACE ('owner' | 'member')
  const isOwner = workspace.owner_id === user.id
  const userMember = workspace.members.find(m => m.user_id === user.id || (m.invited_email && m.invited_email.toLowerCase() === userEmail))
  const userRole: 'owner' | 'member' = isOwner ? 'owner' : (userMember?.role === 'owner' ? 'owner' : 'member')

  // Query auth.users emails for all members in this workspace
  const memberUserIds = workspace.members.map(m => m.user_id)
  let emailMap = new Map<string, string>()

  if (memberUserIds.length > 0) {
    try {
      const authUsers: Array<{ id: string; email: string }> = await prisma.$queryRaw`
        SELECT id::text, email::text FROM auth.users WHERE id = ANY(${memberUserIds}::uuid[])
      `
      emailMap = new Map(authUsers.map(u => [u.id, u.email]))
    } catch (err) {
      console.error('Error fetching auth users emails:', err)
    }
  }

  const enrichedMembers = workspace.members.map(m => {
    const authEmail = emailMap.get(m.user_id) || m.invited_email || m.user?.full_name || 'Anggota Workspace'
    return {
      ...m,
      displayEmail: authEmail,
      displayName: m.user?.full_name || authEmail.split('@')[0]
    }
  })

  return {
    ...workspace,
    members: enrichedMembers,
    userRole
  }
}

export async function updateWorkspaceData(name: string, slug: string) {
  const user = await getUser()

  if (!name || !name.trim()) throw new Error('Nama workspace tidak boleh kosong.')
  if (!slug || !slug.trim()) throw new Error('Slug workspace tidak boleh kosong.')

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').trim()

  const workspace = await prisma.hRWorkspace.findFirst({
    where: {
      OR: [
        { owner_id: user.id },
        { members: { some: { user_id: user.id } } }
      ]
    },
    include: {
      members: true
    }
  })

  if (!workspace) throw new Error('Workspace tidak ditemukan.')

  // RBAC Permission Defense: Check if current user is owner
  const isOwner = workspace.owner_id === user.id || workspace.members.some(m => m.user_id === user.id && m.role === 'owner')
  if (!isOwner) {
    throw new Error('Hanya Owner yang dapat mengubah profil workspace.')
  }

  // Check if slug is taken by another workspace
  const existingSlug = await prisma.hRWorkspace.findFirst({
    where: {
      slug: cleanSlug,
      NOT: { id: workspace.id }
    }
  })

  if (existingSlug) {
    throw new Error('Slug unik sudah digunakan oleh workspace lain. Silakan generate slug baru.')
  }

  // Update in PostgreSQL Database
  const updated = await prisma.hRWorkspace.update({
    where: { id: workspace.id },
    data: {
      name: name.trim(),
      slug: cleanSlug
    }
  })

  revalidatePath('/', 'layout')
  return { success: true, slug: updated.slug, name: updated.name }
}

export async function inviteWorkspaceMember(email: string, role: string = 'member') {
  const user = await getUser()
  const cleanEmail = email.trim().toLowerCase()

  if (!cleanEmail) {
    throw new Error('Email tidak boleh kosong.')
  }

  // Server-Side Defense for Disabled Owner Role Invite
  if (role.toLowerCase() === 'owner') {
    throw new Error('Mohon maaf saat ini belum bisa menambahkan orang ke mode role owner, mohon maaf')
  }

  const workspace = await prisma.hRWorkspace.findFirst({
    where: {
      OR: [
        { owner_id: user.id },
        { members: { some: { user_id: user.id, role: { in: ['owner', 'admin'] } } } }
      ]
    }
  })

  if (!workspace) throw new Error('Workspace tidak ditemukan atau Anda tidak memiliki hak akses.')

  // 1. Check if an invitation for this email ALREADY EXISTS in this workspace
  const existingMemberByEmail = await prisma.hRWorkspaceMember.findFirst({
    where: {
      workspace_id: workspace.id,
      invited_email: cleanEmail
    }
  })

  if (existingMemberByEmail) {
    throw new Error(`Email ${cleanEmail} sudah terdaftar atau diundang di workspace ini.`)
  }

  // 2. Search if user exists in auth.users by email
  const authUsers: Array<{ id: string }> = await prisma.$queryRaw`SELECT id::text FROM auth.users WHERE LOWER(email) = ${cleanEmail} LIMIT 1`

  let targetUserId: string

  if (authUsers.length > 0) {
    targetUserId = authUsers[0].id

    // Check if member already exists by user_id
    const existingMemberByUserId = await prisma.hRWorkspaceMember.findFirst({
      where: {
        workspace_id: workspace.id,
        user_id: targetUserId
      }
    })
    if (existingMemberByUserId) {
      throw new Error(`Pengguna dengan email ${cleanEmail} sudah menjadi anggota di workspace ini.`)
    }
  } else {
    // Generate placeholder UUID for un-registered email
    targetUserId = crypto.randomUUID()
  }

  // 3. Ensure hr_profiles record exists for targetUserId
  await prisma.hRProfile.upsert({
    where: { id: targetUserId },
    update: {},
    create: {
      id: targetUserId,
      full_name: cleanEmail.split('@')[0]
    }
  })

  // 4. Create member invitation in database with initial status PENDING
  const member = await prisma.hRWorkspaceMember.create({
    data: {
      workspace_id: workspace.id,
      user_id: targetUserId,
      role: 'member',
      invited_email: cleanEmail,
      status: 'pending'
    }
  })

  revalidatePath('/', 'layout')
  return { success: true, member }
}

export async function acceptWorkspaceInvitation(invitationId: string) {
  const user = await getUser()
  const userEmail = user.email ? user.email.toLowerCase() : ''

  const member = await prisma.hRWorkspaceMember.findFirst({
    where: {
      id: invitationId,
      OR: [
        { user_id: user.id },
        { invited_email: userEmail }
      ]
    },
    include: {
      workspace: true
    }
  })

  if (!member) throw new Error('Invitation not found or unauthorized')

  await prisma.hRWorkspaceMember.update({
    where: { id: member.id },
    data: {
      status: 'active',
      user_id: user.id
    }
  })

  revalidatePath('/', 'layout')
  return { success: true, workspaceSlug: member.workspace.slug }
}

export async function rejectWorkspaceInvitation(invitationId: string) {
  const user = await getUser()
  const userEmail = user.email ? user.email.toLowerCase() : ''

  const member = await prisma.hRWorkspaceMember.findFirst({
    where: {
      id: invitationId,
      OR: [
        { user_id: user.id },
        { invited_email: userEmail }
      ]
    }
  })

  if (!member) throw new Error('Invitation not found or unauthorized')

  await prisma.hRWorkspaceMember.delete({
    where: { id: member.id }
  })

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getPendingUserInvitations() {
  const user = await getUser()
  const userEmail = user.email ? user.email.toLowerCase() : ''

  if (!userEmail) return []

  const pendingMembers = await prisma.hRWorkspaceMember.findMany({
    where: {
      status: 'pending',
      OR: [
        { user_id: user.id },
        { invited_email: userEmail }
      ]
    },
    include: {
      workspace: {
        include: {
          members: {
            where: { role: 'owner' },
            include: { user: true }
          }
        }
      }
    }
  })

  // Query auth.users emails for workspace owners
  const ownerUserIds = pendingMembers.map(m => m.workspace.owner_id)
  let emailMap = new Map<string, string>()

  if (ownerUserIds.length > 0) {
    try {
      const authUsers: Array<{ id: string; email: string }> = await prisma.$queryRaw`
        SELECT id::text, email::text FROM auth.users WHERE id = ANY(${ownerUserIds}::uuid[])
      `
      emailMap = new Map(authUsers.map(u => [u.id, u.email]))
    } catch (err) {
      console.error('Error fetching owner emails:', err)
    }
  }

  return pendingMembers.map(m => ({
    id: m.id,
    workspaceName: m.workspace.name,
    workspaceSlug: m.workspace.slug,
    ownerEmail: emailMap.get(m.workspace.owner_id) || m.workspace.members[0]?.invited_email || 'Workspace Owner',
    role: m.role,
    created_at: m.joined_at
  }))
}
