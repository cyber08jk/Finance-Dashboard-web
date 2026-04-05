// Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'viewer' | 'analyst' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'viewer' | 'analyst' | 'admin';
}

// Financial Record Types
export interface FinancialRecord {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialRecordRequest {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

export interface RecordsFilterParams {
  type?: 'income' | 'expense';
  category?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

// Dashboard Types
export interface DashboardSummary {
  data: {
    total_income: number;
    total_expenses: number;
    net_balance: number;
    period: {
      from: string | null;
      to: string | null;
    };
    timestamp: string;
  };
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
  count: number;
}

export interface DashboardBreakdown {
  data: {
    breakdown: {
      category: string;
      total: number;
      percent_of_total: string;
    }[];
    total: number;
    scope: 'own' | 'all';
    period: {
      from: string | null;
      to: string | null;
    };
  };
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface DashboardTrends {
  data: {
    trends: MonthlyTrend[];
    timestamp: string;
  };
}

export interface RecentActivity {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
  created_at: string;
}

export interface DashboardRecents {
  data: {
    recent_records: RecentActivity[];
    count: number;
    scope: 'own' | 'all';
  };
}

// Pagination
export interface PaginationMeta {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// API Error Response
export interface ApiError {
  status: number;
  error_code: string;
  message: string;
  timestamp: string;
  fields?: Record<string, string>;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface IncomeVsExpenseData {
  month: string;
  income: number;
  expense: number;
}

// Statistics
export interface CategoryStats {
  category: string;
  total: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}
