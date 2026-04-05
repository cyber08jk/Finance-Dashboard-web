import { hasPermission, rolePermissions } from '../../config/permissions';
import { UserRole } from '../../models/User';

describe('Permissions', () => {
    describe('rolePermissions matrix', () => {
        it('viewer should have view_records and view_summary only', () => {
            const perms = rolePermissions[UserRole.VIEWER];
            expect(perms).toContain('view_records');
            expect(perms).toContain('view_summary');
            expect(perms).not.toContain('create_record');
            expect(perms).not.toContain('update_record');
            expect(perms).not.toContain('delete_record');
            expect(perms).not.toContain('manage_users');
        });

        it('analyst should be able to create and update but not delete or manage users', () => {
            const perms = rolePermissions[UserRole.ANALYST];
            expect(perms).toContain('view_records');
            expect(perms).toContain('create_record');
            expect(perms).toContain('update_record');
            expect(perms).not.toContain('delete_record');
            expect(perms).not.toContain('manage_users');
        });

        it('admin should have all permissions', () => {
            const perms = rolePermissions[UserRole.ADMIN];
            expect(perms).toContain('view_records');
            expect(perms).toContain('create_record');
            expect(perms).toContain('update_record');
            expect(perms).toContain('delete_record');
            expect(perms).toContain('manage_users');
            expect(perms).toContain('manage_roles');
        });
    });

    describe('hasPermission', () => {
        it('returns true when role has permission', () => {
            expect(hasPermission(UserRole.ADMIN, 'delete_record')).toBe(true);
            expect(hasPermission(UserRole.ANALYST, 'create_record')).toBe(true);
            expect(hasPermission(UserRole.VIEWER, 'view_records')).toBe(true);
        });

        it('returns false when role does not have permission', () => {
            expect(hasPermission(UserRole.VIEWER, 'create_record')).toBe(false);
            expect(hasPermission(UserRole.VIEWER, 'delete_record')).toBe(false);
            expect(hasPermission(UserRole.ANALYST, 'delete_record')).toBe(false);
            expect(hasPermission(UserRole.ANALYST, 'manage_users')).toBe(false);
        });
    });
});
