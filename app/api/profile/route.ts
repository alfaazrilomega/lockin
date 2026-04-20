import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).nullable().optional(),
  headline: z.string().max(100).nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal('')),
  location: z.string().max(100).nullable().optional(),
  githubUrl: z.string().url().nullable().optional().or(z.literal('')),
  linkedinUrl: z.string().url().nullable().optional().or(z.literal('')),
  twitterUrl: z.string().url().nullable().optional().or(z.literal('')),
});

export async function GET() {
  try {
    const authUser = await requireUser();
    
    const profile = await prisma.userProfile.findUnique({
      where: { userId: authUser.id },
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } }
      }
    });

    if (!profile) {
      // In case requireUser retroactive backfill didn't run or failed
      const newProfile = await prisma.userProfile.create({
        data: { userId: authUser.id },
        include: { user: { select: { name: true, email: true, avatarUrl: true } } }
      });
      return NextResponse.json({ success: true, data: newProfile });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authUser = await requireUser();
    const body = await req.json();
    
    const validation = updateProfileSchema.parse(body);

    // Update user root fields if provided
    if (validation.name) {
      await prisma.user.update({
        where: { id: authUser.id },
        data: { name: validation.name }
      });
    }

    // Prepare profile data (filtering out name as it belongs to User)
    const { name, ...profileData } = validation;
    
    // Clean up empty strings from URLs to null
    const cleanedProfileData = {
      ...profileData,
      website: profileData.website === '' ? null : profileData.website,
      githubUrl: profileData.githubUrl === '' ? null : profileData.githubUrl,
      linkedinUrl: profileData.linkedinUrl === '' ? null : profileData.linkedinUrl,
      twitterUrl: profileData.twitterUrl === '' ? null : profileData.twitterUrl,
    };

    const profile = await prisma.userProfile.upsert({
      where: { userId: authUser.id },
      create: { 
        userId: authUser.id, 
        ...cleanedProfileData 
      },
      update: cleanedProfileData,
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } }
      }
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("Profile update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
