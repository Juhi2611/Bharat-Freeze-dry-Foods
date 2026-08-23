import { useEffect, useState } from 'react';
import { api } from '@/services/api';

const FALLBACK_INR_PER_USD = 85;

export function useFxRate() {
  const [inrPerUsd, setInrPerUsd] = useState(FALLBACK_INR_PER_USD);
  const [meta, setMeta] = useState<{
    source?: string;
    cached?: boolean;
    fallback?: string;
  }>({});

  useEffect(() => {
    let cancelled = false;
    api
      .getFxRate()
      .then((rate) => {
        if (cancelled || !rate.inr_per_usd || rate.inr_per_usd <= 0) return;
        setInrPerUsd(rate.inr_per_usd);
        setMeta({
          source: rate.source,
          cached: rate.cached,
          fallback: rate.fallback,
        });
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const inrToUsd = (inr: number) => inr / inrPerUsd;

  return { inrPerUsd, inrToUsd, meta };
}
