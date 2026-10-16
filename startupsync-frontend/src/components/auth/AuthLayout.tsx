import React from 'react';
import { Hexagon, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-6 py-10 sm:px-8">
        <div className="mb-10 flex items-center gap-2.5">
          <Hexagon size={26} className="fill-black text-black" strokeWidth={1.5} />
          <span className="text-xl font-bold tracking-tight text-black">StartupSync</span>
        </div>

        <div className="flex-1">{children}</div>

        <footer className="mt-16 border-t border-slate-100 pt-10">
          <Sparkles size={26} className="text-brand-500" strokeWidth={1.5} />
          <h3 className="mt-4 text-lg font-bold text-slate-900">Build your dream team.</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Join thousands of founders and builders connecting, collaborating, and launching the next big thing on StartupSync.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
