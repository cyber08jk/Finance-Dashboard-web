import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User.js';

export enum RecordType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Entity('financial_records')
@Index(['user_id'])
@Index(['date'])
@Index(['category'])
@Index(['type'])
export class FinancialRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: RecordType })
  type!: RecordType;

  @Column({ type: 'varchar', length: 100 })
  category!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
