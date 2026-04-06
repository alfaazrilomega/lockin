-- Migration: Add Workspace Kanban functionality to Tasks API
-- We need to ensure the tasks table has row level security mapped via workspace association
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view tasks"
ON "tasks" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "workspace_members" wm 
    WHERE wm.workspace_id = tasks.workspace_id AND wm.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM "workspaces" w 
    WHERE w.id = tasks.workspace_id AND w.owner_id = auth.uid()
  )
);

CREATE POLICY "Workspace Editors and Leaders can insert tasks"
ON "tasks" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "workspace_members" wm 
    WHERE wm.workspace_id = tasks.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.permission IN ('EDITOR', 'LEADER')
  )
  OR
  EXISTS (
    SELECT 1 FROM "workspaces" w 
    WHERE w.id = tasks.workspace_id AND w.owner_id = auth.uid()
  )
);

CREATE POLICY "Workspace Editors and Leaders can update tasks"
ON "tasks" FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "workspace_members" wm 
    WHERE wm.workspace_id = tasks.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.permission IN ('EDITOR', 'LEADER')
  )
  OR
  EXISTS (
    SELECT 1 FROM "workspaces" w 
    WHERE w.id = tasks.workspace_id AND w.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "workspace_members" wm 
    WHERE wm.workspace_id = tasks.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.permission IN ('EDITOR', 'LEADER')
  )
  OR
  EXISTS (
    SELECT 1 FROM "workspaces" w 
    WHERE w.id = tasks.workspace_id AND w.owner_id = auth.uid()
  )
);

CREATE POLICY "Workspace Editors and Leaders can delete tasks"
ON "tasks" FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "workspace_members" wm 
    WHERE wm.workspace_id = tasks.workspace_id 
    AND wm.user_id = auth.uid() 
    AND wm.permission IN ('EDITOR', 'LEADER')
  )
  OR
  EXISTS (
    SELECT 1 FROM "workspaces" w 
    WHERE w.id = tasks.workspace_id AND w.owner_id = auth.uid()
  )
);
