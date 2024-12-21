// src/hooks/useCompany.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

export function useCompany(companyId: string | null) {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanyName() {
      if (!companyId) {
        setCompanyName(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('name')
          .eq('id', companyId)
          .single();

        if (error) throw error;
        setCompanyName(data?.name || null);
      } catch (error) {
        console.error('Error fetching company name:', error);
        setCompanyName(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyName();
  }, [companyId]);

  return { companyName, loading };
}