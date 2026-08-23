import { Link, useRouterState } from '@tanstack/react-router';
import { Building2, Package, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { to: '/account', label: 'My Profile', icon: User, exact: true },
  { to: '/account/orders', label: 'My Orders', icon: Package, exact: false },
] as const;

export function AccountShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-24 text-frost-white sm:px-8 sm:pt-28">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-card/60 p-4 backdrop-blur-xl lg:sticky lg:top-28">
          <div className="mb-4 border-b border-white/10 pb-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ice-blue">
              Customer account
            </p>
            <p className="mt-2 truncate text-sm font-bold text-frost-white">{user?.full_name}</p>
            <p className="truncate text-xs text-steel-silver">{user?.email}</p>
            {user?.company_name && (
              <p className="mt-1 flex items-center gap-1 truncate text-[0.7rem] text-steel-silver">
                <Building2 className="h-3 w-3 shrink-0" />
                {user.company_name}
              </p>
            )}
          </div>

          <nav className="space-y-1">
            {NAV.map(({ to, label, icon: Icon, exact }) => {
              const active = exact
                ? pathname === to || pathname === `${to}/`
                : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-ice-blue/15 text-ice-blue border border-ice-blue/30'
                      : 'text-steel-silver hover:bg-white/5 hover:text-frost-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => logout('/')}
            className="mt-4 flex w-full items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/15"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <section>{children}</section>
      </div>
    </main>
  );
}
