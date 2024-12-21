import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';

interface Preset {
  id: string;
  name: string;
  options: any[];
  company_id: string;
}

interface PresetStore {
  presets: Preset[];
  loading: boolean;
  error: string | null;
  fetchPresets: (companyId: string) => Promise<void>;
  addPreset: (preset: Omit<Preset, 'id'>) => Promise<void>;
}

export const usePresetStore = create<PresetStore>((set) => ({
  presets: [],
  loading: false,
  error: null,
  
  fetchPresets: async (companyId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('template_presets')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;
      set({ presets: data || [] });
    } catch (error) {
      console.error('Error fetching presets:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addPreset: async (preset) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('template_presets')
        .insert([preset]);

      if (error) throw error;
      
      // Refetch presets after adding
      const { data: updatedData, error: fetchError } = await supabase
        .from('template_presets')
        .select('*')
        .eq('company_id', preset.company_id);
      
      if (fetchError) throw fetchError;
      set({ presets: updatedData || [] });
    } catch (error) {
      console.error('Error adding preset:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));