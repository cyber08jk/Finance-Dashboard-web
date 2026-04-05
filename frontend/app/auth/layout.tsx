import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950">
            {/* Left side - Brand panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden isolate">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-zinc-900 opacity-90 z-10" />
                <div
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }}
                />
                <div className="absolute -left-48 -bottom-48 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[128px] z-10 animate-blob" />
                <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] z-10 animate-blob animation-delay-2000" />

                <div className="relative z-20 flex flex-col justify-between p-16 w-full max-w-2xl mx-auto h-full text-white">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Valut</span>
                    </Link>

                    <div>
                        <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
                            Professional Grade <br />
                            <span className="text-primary-300">Financial Management.</span>
                        </h1>
                        <p className="text-lg text-zinc-300 max-w-lg font-medium">
                            Secure, role-based access for deep financial analytics, expense tracking, and enterprise-level insight aggregation.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold ring-2 ring-primary-500/20">
                                        U{i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-zinc-400">Join 10,000+ professionals</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-32 relative">
                <div className="absolute top-8 right-8 lg:hidden">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white dark:text-zinc-900" />
                    </div>
                </div>
                <div className="mx-auto w-full max-w-sm lg:w-[400px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
