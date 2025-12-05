import { FC } from 'react';
import Link from 'next/link';
import SignupForm from '@/components/SignupForm';

const SignupPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10 p-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;