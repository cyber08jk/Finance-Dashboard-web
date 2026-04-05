import { recordService } from '../../services/RecordService';
import { RecordType } from '../../models/FinancialRecord';
import { UserRole } from '../../models/User';
import { AuthorizationError, NotFoundError } from '../../utils/errors';

jest.mock('../../repositories/FinancialRecordRepository', () => ({
  recordRepository: {
    create: jest.fn(),
    findByIdWithUser: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  },
}));

const { recordRepository: mockRecordRepository } = jest.requireMock(
  '../../repositories/FinancialRecordRepository'
);

describe('RecordService RBAC + CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('limits viewer listing to own records', async () => {
    mockRecordRepository.findAll.mockResolvedValue({ records: [], total: 0 });

    await recordService.listRecords('user-1', UserRole.VIEWER, {
      limit: 10,
      offset: 0,
    });

    expect(mockRecordRepository.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        limit: 10,
        offset: 0,
      })
    );
  });

  it('blocks viewer from updating records', async () => {
    mockRecordRepository.findByIdWithUser.mockResolvedValue({ id: 'r1', user_id: 'user-1' });

    await expect(
      recordService.updateRecord('r1', 'user-1', UserRole.VIEWER, { category: 'Updated' } as any)
    ).rejects.toThrow(AuthorizationError);
  });

  it('blocks analyst from updating another user record', async () => {
    mockRecordRepository.findByIdWithUser.mockResolvedValue({ id: 'r1', user_id: 'owner-1' });

    await expect(
      recordService.updateRecord('r1', 'analyst-1', UserRole.ANALYST, { category: 'Updated' } as any)
    ).rejects.toThrow('You can only update your own records');
  });

  it('allows analyst to update own record', async () => {
    mockRecordRepository.findByIdWithUser.mockResolvedValue({ id: 'r1', user_id: 'analyst-1' });
    mockRecordRepository.update.mockResolvedValue({
      id: 'r1',
      user_id: 'analyst-1',
      amount: 100,
      type: RecordType.EXPENSE,
      category: 'Food',
      date: new Date('2026-04-01'),
      description: null,
      created_by: 'analyst-1',
      created_at: new Date('2026-04-01'),
      updated_at: new Date('2026-04-02'),
      deleted_at: null,
    });

    const result = await recordService.updateRecord('r1', 'analyst-1', UserRole.ANALYST, {
      category: 'Dining',
    } as any);

    expect(result.id).toBe('r1');
    expect(mockRecordRepository.update).toHaveBeenCalledWith('r1', { category: 'Dining' });
  });

  it('blocks non-admin delete', async () => {
    mockRecordRepository.findByIdWithUser.mockResolvedValue({ id: 'r1', user_id: 'user-1' });

    await expect(recordService.deleteRecord('r1', 'user-1', UserRole.ANALYST)).rejects.toThrow(
      'Only admins can delete records'
    );
  });

  it('allows admin delete', async () => {
    mockRecordRepository.findByIdWithUser.mockResolvedValue({ id: 'r1', user_id: 'user-1' });
    mockRecordRepository.softDelete.mockResolvedValue(undefined);

    await expect(recordService.deleteRecord('r1', 'admin-1', UserRole.ADMIN)).resolves.toBeUndefined();
    expect(mockRecordRepository.softDelete).toHaveBeenCalledWith('r1');
  });

  it('throws not found when record is missing', async () => {
    mockRecordRepository.findByIdWithUser.mockResolvedValue(null);

    await expect(
      recordService.getRecordById('missing', 'user-1', UserRole.ADMIN)
    ).rejects.toThrow(NotFoundError);
  });
});
