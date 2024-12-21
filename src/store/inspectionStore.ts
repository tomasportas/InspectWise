import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import type { Inspection } from '../types';

interface InspectionStore {
  inspections: Inspection[];
  loading: boolean;
  error: string | null;
  fetchInspections: (companyId: string) => Promise<void>;
  addInspection: (inspection: Omit<Inspection, 'id'>, companyId: string) => Promise<void>;
  updateInspection: (id: string, inspection: Omit<Inspection, 'id'>) => Promise<void>;
  deleteInspection: (id: string) => Promise<void>;
}

export const useInspectionStore = create<InspectionStore>((set) => ({
  inspections: [],
  loading: false,
  error: null,

  fetchInspections: async (companyId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false });
      
      if (error) throw error;

      const transformedData = data.map(inspection => ({
        id: inspection.id,
        templateId: inspection.template_id,
        inspectorName: inspection.inspector_name,
        status: inspection.status,
        date: new Date(inspection.date),
        location: inspection.location,
        responses: inspection.responses,
        company_id: inspection.company_id
      }));
      
      set({ inspections: transformedData });
    } catch (error) {
      console.error('Error fetching inspections:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addInspection: async (inspection, companyId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('inspections')
        .insert([{
          template_id: inspection.templateId,
          inspector_name: inspection.inspectorName,
          status: inspection.status,
          date: inspection.date.toISOString(),
          location: inspection.location,
          responses: inspection.responses,
          company_id: companyId
        }]);
      
      if (error) throw error;
      
      // Refetch to get updated list
      const { data: updatedData, error: fetchError } = await supabase
        .from('inspections')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false });
      
      if (fetchError) throw fetchError;

      const transformedData = updatedData.map(inspection => ({
        id: inspection.id,
        templateId: inspection.template_id,
        inspectorName: inspection.inspector_name,
        status: inspection.status,
        date: new Date(inspection.date),
        location: inspection.location,
        responses: inspection.responses,
        company_id: inspection.company_id
      }));
      
      set({ inspections: transformedData });
    } catch (error) {
      console.error('Error adding inspection:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateInspection: async (id, inspection) => {
    set({ loading: true, error: null });
    try {
      // Get the company_id first
      const { data: currentInspection } = await supabase
        .from('inspections')
        .select('company_id')
        .eq('id', id)
        .single();

      if (!currentInspection) throw new Error('Inspection not found');

      const { error } = await supabase
        .from('inspections')
        .update({
          template_id: inspection.templateId,
          inspector_name: inspection.inspectorName,
          status: inspection.status,
          date: inspection.date.toISOString(),
          location: inspection.location,
          responses: inspection.responses
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch to get updated list
      const { data: updatedData, error: fetchError } = await supabase
        .from('inspections')
        .select('*')
        .eq('company_id', currentInspection.company_id)
        .order('date', { ascending: false });
      
      if (fetchError) throw fetchError;

      const transformedData = updatedData.map(inspection => ({
        id: inspection.id,
        templateId: inspection.template_id,
        inspectorName: inspection.inspector_name,
        status: inspection.status,
        date: new Date(inspection.date),
        location: inspection.location,
        responses: inspection.responses,
        company_id: inspection.company_id
      }));
      
      set({ inspections: transformedData });
    } catch (error) {
      console.error('Error updating inspection:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteInspection: async (id) => {
    set({ loading: true, error: null });
    try {
      // Get the company_id first
      const { data: currentInspection } = await supabase
        .from('inspections')
        .select('company_id')
        .eq('id', id)
        .single();

      if (!currentInspection) throw new Error('Inspection not found');

      const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch to get updated list
      const { data: updatedData, error: fetchError } = await supabase
        .from('inspections')
        .select('*')
        .eq('company_id', currentInspection.company_id)
        .order('date', { ascending: false });
      
      if (fetchError) throw fetchError;

      const transformedData = updatedData.map(inspection => ({
        id: inspection.id,
        templateId: inspection.template_id,
        inspectorName: inspection.inspector_name,
        status: inspection.status,
        date: new Date(inspection.date),
        location: inspection.location,
        responses: inspection.responses,
        company_id: inspection.company_id
      }));
      
      set({ inspections: transformedData });
    } catch (error) {
      console.error('Error deleting inspection:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));