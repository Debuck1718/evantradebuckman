export type WorkspaceNodeType =
  | "account"
  | "organization"
  | "team"
  | "workspace"
  | "project"
  | "calendar"
  | "event"
  | "document";

export interface WorkspaceNode {
  id: string;
  type: WorkspaceNodeType;
  label: string;
  metadata?: Record<string, unknown>;
}

export type WorkspaceEdgeType =
  | "owns"
  | "member_of"
  | "assigned_to"
  | "depends_on"
  | "invited_to"
  | "manages";

export interface WorkspaceEdge {
  id: string;
  type: WorkspaceEdgeType;
  fromNodeId: string;
  toNodeId: string;
  metadata?: Record<string, unknown>;
}

export interface WorkspaceGraph {
  nodes: readonly WorkspaceNode[];
  edges: readonly WorkspaceEdge[];
}
