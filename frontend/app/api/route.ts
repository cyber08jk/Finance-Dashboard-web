import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 200,
    message: 'Finance Dashboard Backend API is running',
    docs: {
      health: '/api/health',
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login'
      }
    },
    timestamp: new Date().toISOString()
  });
}
