import { hashPassword, comparePassword } from '../../utils/auth';

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    test('should hash a password correctly', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    test('should produce different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    test('should match correct password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    test('should not match incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });
  });
});
