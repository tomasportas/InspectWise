import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import type { Template, Question } from '../types';

interface TemplateResponse {
  id: string;
  name: string;
  created_at: string;
  questions: Question[];
  company_id: string;
}

interface TemplateStore {
  templates: Template[];
  loading: boolean;
  error: string | null;
  fetchTemplates: (companyId: string) => Promise<void>;
  addTemplate: (template: Pick<Template, 'name' | 'questions'>, companyId: string) => Promise<void>;
  updateTemplate: (id: string, template: Pick<Template, 'name' | 'questions'>, companyId: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  loading: false,
  error: null,

  fetchTemplates: async (companyId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('get_company_templates', { company_id_param: companyId });
      if (error) throw error;
  
      set({
        templates: data.map((template: TemplateResponse) => ({
          id: template.id,
          name: template.name,
          createdAt: new Date(template.created_at),
          questions: template.questions,
          companyId: template.company_id,
        })),
      });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: 'Unknown error occurred' });
      }
    } finally {
      set({ loading: false });
    }
  },

  addTemplate: async (template: Pick<Template, 'name' | 'questions'>, companyId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.rpc('create_template', {
        template_name: template.name,
        template_questions: template.questions,
        company_id: companyId,
      });
      if (error) throw error;
      await useTemplateStore.getState().fetchTemplates(companyId);
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: 'Unknown error occurred' });
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateTemplate: async (id: string, template: Pick<Template, 'name' | 'questions'>, companyId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('templates')
        .update({
          name: template.name,
          questions: template.questions,
        })
        .eq('id', id)
        .eq('company_id', companyId);
      if (error) throw error;
      await useTemplateStore.getState().fetchTemplates(companyId);
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: 'Unknown error occurred' });
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
