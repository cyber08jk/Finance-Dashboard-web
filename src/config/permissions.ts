import { UserRole } from '../models/User.js';

// Define permissions for each role
export type Permission = 
  | 'view_records'
  | 'create_record'
  | 'update_record'
  | 'delete_record'
  | 'view_summary'
  | 'manage_users'
  | 'manage_roles';

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.VIEWER]: [
    'view_records',
    'view_summary',
  ],
  [UserRole.ANALYST]: [
    'view_records',
    'create_record',
    'update_record',
    'view_summary',
  ],
  [UserRole.ADMIN]: [
    'view_records',
    'create_record',
    'update_record',
    'delete_record',
    'view_summary',
    'manage_users',
    'manage_roles',
  ],
};

// Helper function to check if a role has a permission
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

// Role descriptions for API responses
export const roleDescriptions: Record<UserRole, object> = {
  [UserRole.VIEWER]: {
    name: UserRole.VIEWER,
    description: 'Can only view dashboard data and records',
    permissions: rolePermissions[UserRole.VIEWER],
  },
  [UserRole.ANALYST]: {
    name: UserRole.ANALYST,
    description: 'Can view records, create and update records, and access insights',
    permissions: rolePermissions[UserRole.ANALYST],
  },
  [UserRole.ADMIN]: {
    name: UserRole.ADMIN,
    description: 'Full management access including users, records, and system configuration',
    permissions: rolePermissions[UserRole.ADMIN],
  },
};
