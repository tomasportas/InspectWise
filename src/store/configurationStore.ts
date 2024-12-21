import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';

interface Configuration {
  id: string;
  name: string;
  options: string[];
}

interface ConfigurationStore {
  configurations: Configuration[];
  loading: boolean;
  error: string | null;
  fetchConfigurations: () => Promise<void>;
  addConfiguration: (configuration: Omit<Configuration, 'id'>) => Promise<void>;
  updateConfiguration: (id: string, configuration: Omit<Configuration, 'id'>) => Promise<void>;
  removeConfiguration: (id: string) => Promise<void>;
}

export const useConfigurationStore = create<ConfigurationStore>((set) => ({
  configurations: [],
  loading: false,
  error: null,

  fetchConfigurations: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('template_presets')
        .select('*');
      
      if (error) throw error;
      
      set({ configurations: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addConfiguration: async (configuration) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('template_presets')
        .insert([{
          name: configuration.name,
          options: configuration.options
        }]);
      
      if (error) throw error;
      
      // Refetch to get updated list
      const { data: updatedData, error: fetchError } = await supabase
        .from('template_presets')
        .select('*');
      
      if (fetchError) throw fetchError;
      
      set({ configurations: updatedData || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateConfiguration: async (id, configuration) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('template_presets')
        .update({
          name: configuration.name,
          options: configuration.options
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch to get updated list
      const { data: updatedData, error: fetchError } = await supabase
        .from('template_presets')
        .select('*');
      
      if (fetchError) throw fetchError;
      
      set({ configurations: updatedData || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  removeConfiguration: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('template_presets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch to get updated list
      const { data: updatedData, error: fetchError } = await supabase
        .from('template_presets')
        .select('*');
      
      if (fetchError) throw fetchError;
      
      set({ configurations: updatedData || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));