import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loadPublicContact } from './whatsapp';

const PublicContactContext = createContext(false);

/** Loads CMS WhatsApp/phone once; re-renders children when ready. */
export function PublicContactProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadPublicContact().finally(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PublicContactContext.Provider value={ready}>{children}</PublicContactContext.Provider>
  );
}

export function usePublicContactReady(): boolean {
  return useContext(PublicContactContext);
}
