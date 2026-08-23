import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export const Route = createFileRoute('/account')({
  component: AccountLayout,
});

function AccountLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { setIsAuthOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    // Unauthenticated: open customer AuthModal and stay on /account/* so
    // post-login the user remains on the URL they requested (e.g. /account/orders).
    // Never send buyers to /admin/login.
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }

    // Non-customer staff: send to admin OS (shared AuthContext, distinct roles).
    if (user?.role !== 'customer') {
      void navigate({ to: '/admin', replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, setIsAuthOpen, user?.role]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-steel-silver">
        Checking account access...
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-sm text-steel-silver">
          Sign in with your customer account to view orders and account details.
        </p>
        <button
          type="button"
          onClick={() => setIsAuthOpen(true)}
          className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
        >
          Customer sign in
        </button>
      </main>
    );
  }

  if (user?.role !== 'customer') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-steel-silver">
        Redirecting to admin...
      </main>
    );
  }

  return <Outlet />;
}
