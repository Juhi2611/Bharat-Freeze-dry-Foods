import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, ShieldCheck, User } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';

export const Route = createFileRoute('/account/')({
  component: AccountProfilePage,
});

function AccountProfilePage() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name || '');
    setCompanyName(user.company_name || '');
    setCountry(user.country || '');
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full name is required.');
      return;
    }
    setSaving(true);
    try {
      await api.updateMe({
        full_name: fullName.trim(),
        company_name: companyName.trim(),
        country: country.trim(),
      });
      await refreshUser();
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <AccountShell>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-steel-silver hover:text-ice-blue"
      >
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-ice-blue">Account settings</p>
          <h1 className="mt-2 text-3xl font-semibold">My profile</h1>
          <p className="mt-2 text-sm text-steel-silver">
            Manage your B2B buyer details used for orders and export enquiries.
          </p>
        </div>
        <User className="hidden h-10 w-10 text-ice-blue/70 sm:block" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(e) => void handleSave(e)}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
        >
          <h2 className="mb-4 text-sm font-bold text-frost-white">Profile details</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-deep-navy/60 px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-steel-silver opacity-70"
              />
              <p className="mt-1 text-[0.65rem] text-steel-silver">Email cannot be changed here.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Company
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your business name"
                className="w-full rounded-xl border border-white/10 bg-deep-navy/60 px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-steel-silver">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. India, USA, UAE"
                className="w-full rounded-xl border border-white/10 bg-deep-navy/60 px-3 py-2.5 text-sm text-frost-white focus:border-ice-blue focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary-cta px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save profile
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-frost-white">
              <ShieldCheck className="h-4 w-4 text-ice-blue" />
              Account status
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-steel-silver">Role</dt>
                <dd className="font-semibold capitalize text-frost-white">{user.role.replace('_', ' ')}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-steel-silver">Member since</dt>
                <dd className="text-frost-white">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : '—'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-ice-blue/20 bg-ice-blue/5 p-5">
            <h2 className="mb-2 text-sm font-bold text-frost-white">Quick links</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/account/orders"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-ice-blue hover:bg-white/10"
              >
                View my orders
              </Link>
              <Link
                to="/products"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white hover:bg-white/10"
              >
                Browse catalog
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-frost-white hover:bg-white/10"
              >
                Contact export team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
