import {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    DatabaseError,
} from '../../utils/errors';

describe('Custom Error Classes', () => {
    describe('AppError', () => {
        it('should set message, statusCode, and errorCode correctly', () => {
            const err = new AppError('Something broke', 500, 'BROKEN');
            expect(err.message).toBe('Something broke');
            expect(err.statusCode).toBe(500);
            expect(err.errorCode).toBe('BROKEN');
            expect(err instanceof Error).toBe(true);
        });
    });

    describe('ValidationError', () => {
        it('should have status 400 and VALIDATION_ERROR code', () => {
            const err = new ValidationError('Bad input', { field: 'Required' });
            expect(err.statusCode).toBe(400);
            expect(err.errorCode).toBe('VALIDATION_ERROR');
            expect(err.fields).toEqual({ field: 'Required' });
        });
    });

    describe('AuthenticationError', () => {
        it('should have status 401 and AUTHENTICATION_ERROR code', () => {
            const err = new AuthenticationError();
            expect(err.statusCode).toBe(401);
            expect(err.errorCode).toBe('AUTHENTICATION_ERROR');
        });

        it('should accept a custom message', () => {
            const err = new AuthenticationError('Token expired');
            expect(err.message).toBe('Token expired');
        });
    });

    describe('AuthorizationError', () => {
        it('should have status 403 and AUTHORIZATION_ERROR code', () => {
            const err = new AuthorizationError();
            expect(err.statusCode).toBe(403);
            expect(err.errorCode).toBe('AUTHORIZATION_ERROR');
        });
    });

    describe('NotFoundError', () => {
        it('should format message as "<Resource> not found"', () => {
            const err = new NotFoundError('User');
            expect(err.message).toBe('User not found');
            expect(err.statusCode).toBe(404);
            expect(err.errorCode).toBe('NOT_FOUND');
        });
    });

    describe('ConflictError', () => {
        it('should have status 409 and CONFLICT code', () => {
            const err = new ConflictError('Duplicate email');
            expect(err.statusCode).toBe(409);
            expect(err.errorCode).toBe('CONFLICT');
            expect(err.message).toBe('Duplicate email');
        });
    });

    describe('DatabaseError', () => {
        it('should have status 500 and DATABASE_ERROR code', () => {
            const err = new DatabaseError();
            expect(err.statusCode).toBe(500);
            expect(err.errorCode).toBe('DATABASE_ERROR');
        });
    });
});
