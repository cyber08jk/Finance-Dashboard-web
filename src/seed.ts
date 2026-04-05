import dotenv from 'dotenv';

dotenv.config();

/**
 * Admin Seed Script
 *
 * Creates a default admin user if none exists.
 * Run with: npx tsx src/seed.ts
 *
 * Default credentials:
 *   Email:    admin@finance.local
 *   Password: Admin@1234
 *
 * Change the password immediately after first login!
 */

import { AppDataSource } from './config/database.js';
import { userRepository } from './repositories/UserRepository.js';
import { hashPassword } from './utils/auth.js';
import { UserRole } from './models/User.js';

const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@finance.local';
const SEED_ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || 'admin';
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';

async function seed() {
    console.log('Connecting to database...');
    await AppDataSource.initialize();

    const existing = await userRepository.findByEmail(SEED_ADMIN_EMAIL);
    if (existing) {
        console.log(`✓ Admin user already exists: ${SEED_ADMIN_EMAIL} (role: ${existing.role})`);
        await AppDataSource.destroy();
        return;
    }

    const passwordHash = await hashPassword(SEED_ADMIN_PASSWORD);
    const admin = await userRepository.create(
        SEED_ADMIN_EMAIL,
        SEED_ADMIN_USERNAME,
        passwordHash,
        UserRole.ADMIN
    );

    const adminExists = !!existing;
    const targetUser = existing || admin;

    // Check if records already exist
    const { recordRepository } = await import('./repositories/FinancialRecordRepository.js');
    const { RecordType } = await import('./models/FinancialRecord.js');
    const existingRecords = await recordRepository.getRecentRecords(targetUser.id, 1);

    if (existingRecords.length > 0) {
        console.log('✓ Financial records already seeded.');
        await AppDataSource.destroy();
        return;
    }

    console.log('Seeding financial records for dashboard...');
    const categories = {
        income: ['Salary', 'Freelance', 'Investments', 'Bonus'],
        expense: ['Rent', 'Groceries', 'Utilities', 'Transportation', 'Entertainment', 'Dining', 'Software']
    };

    // Generate ~150 records over the last 120 days
    const now = new Date();
    await AppDataSource.transaction(async (manager) => {
        for (let i = 0; i < 150; i++) {
            const isIncome = Math.random() > 0.6; // 40% chance of income
            const type = isIncome ? RecordType.INCOME : RecordType.EXPENSE;

            const cats = isIncome ? categories.income : categories.expense;
            const category = cats[Math.floor(Math.random() * cats.length)];

            // Random amount (Income: 500-5000, Expense: 10-500)
            const amount = isIncome
                ? Math.floor(Math.random() * 4500) + 500
                : Math.floor(Math.random() * 490) + 10;

            // Random date in last 120 days
            const daysAgo = Math.floor(Math.random() * 120);
            const date = new Date(now);
            date.setDate(date.getDate() - daysAgo);

            await recordRepository.create(
                targetUser.id,
                amount,
                type,
                category,
                date,
                `Mock ${category} transaction`,
                targetUser.id
            );
        }
    });

    console.log('✓ Successfully seeded 150 financial records!');
    await AppDataSource.destroy();
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
