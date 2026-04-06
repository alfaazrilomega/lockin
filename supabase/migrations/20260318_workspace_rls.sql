-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- SELECT: Owners and members can view
CREATE POLICY "Users can view workspaces they own or belong to" 
ON workspaces FOR SELECT 
TO authenticated 
USING (
  owner_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_members.workspace_id = workspaces.id 
    AND workspace_members.user_id = auth.uid()
  )
);

-- INSERT: Authenticated users can create
CREATE POLICY "Users can create their own workspaces" 
ON workspaces FOR INSERT 
TO authenticated 
WITH CHECK (
  owner_id = auth.uid()
);

-- UPDATE: Owners and LEADER/EDITOR members can update
CREATE POLICY "Owners and editors can update workspaces" 
ON workspaces FOR UPDATE 
TO authenticated 
USING (
  owner_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_members.workspace_id = workspaces.id 
    AND workspace_members.user_id = auth.uid()
    AND workspace_members.permission IN ('LEADER', 'EDITOR')
  )
);

-- DELETE: Only owners can delete
CREATE POLICY "Only owners can delete workspaces" 
ON workspaces FOR DELETE 
TO authenticated 
USING (
  owner_id = auth.uid()
);
