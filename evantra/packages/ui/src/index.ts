export interface WorkspaceNavItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
  requiredPermission?: string;
}

export interface WorkspaceNavSection {
  id: string;
  label: string;
  items: readonly WorkspaceNavItem[];
}

export interface WorkspaceHomeCard {
  id: string;
  title: string;
  description: string;
  route: string;
}
