import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UsersRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — BFF" },
      { name: "description", content: "Sign in to the BFF administration portal." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const authenticatedUser = await login(email, password);
      if (authenticatedUser.role === "customer") {
        logout();
        setError("This account does not have admin access.");
        return;
      }
      await navigate({ to: "/admin" });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Invalid email or password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-deep-navy px-4 py-8 text-frost-white sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(79,168,216,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(79,168,216,0.08)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-ice-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-spice-orange/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-card/70 shadow-2xl backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden border-b border-white/10 p-7 sm:p-10 md:border-b-0 md:border-r lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-ice-blue/20" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border border-ice-blue/15" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-ice-blue/30 bg-ice-blue/10 text-ice-blue">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wide text-frost-white">BFF</p>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-steel-silver">Bharat Freeze Dry Foods</p>
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-ice-blue">Global Export OS</p>
              <h1 className="mt-4 max-w-lg text-3xl font-bold leading-tight text-frost-white sm:text-4xl">
                Admin operations, kept at the peak.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-steel-silver">
                One secure workspace for the people, products, and export details moving BFF forward.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {[
                { icon: LockKeyhole, label: "Secure access", detail: "JWT protected" },
                { icon: UsersRound, label: "Role aware", detail: "Teams stay focused" },
                { icon: Activity, label: "Live control", detail: "Export operations" },
              ].map(({ icon: Icon, label, detail }) => (
                <div key={label} className="border-l border-ice-blue/40 pl-3">
                  <Icon className="h-4 w-4 text-ice-blue" />
                  <p className="mt-2 text-xs font-bold text-frost-white">{label}</p>
                  <p className="mt-1 text-[0.65rem] text-steel-silver">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative max-h-[calc(100vh-2rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-7 sm:p-9 lg:p-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-ice-blue/30 bg-ice-blue/10 text-ice-blue">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ice-blue">BFF Admin</p>
          <h1 className="mt-2 text-2xl font-bold">Sign in to operations</h1>
          <p className="mt-2 text-sm text-steel-silver">Use an authorized administrator account.</p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-steel-silver">Email</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-frost-white outline-none focus:border-ice-blue"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-steel-silver">Password</span>
            <span className="relative block">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-silver" />
              <input
                required
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-sm text-frost-white outline-none focus:border-ice-blue"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-steel-silver transition hover:text-frost-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ice-blue"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-primary-cta px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        </section>
      </div>
    </main>
  );
}