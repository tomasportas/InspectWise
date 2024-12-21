// src/pages/CreateTemplatePage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CreateTemplateForm } from '../components/forms/CreateTemplateForm';
import { ConfigurationModal } from '../components/forms/configuration/ConfigurationModal';
import { Template } from '../types';
import { nanoid } from 'nanoid';
import { useAuth } from '../context/AuthContext';

interface CreateTemplatePageProps {
  companyId: string;
}

export function CreateTemplatePage({ companyId }: CreateTemplatePageProps) {
  const navigate = useNavigate();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleSubmit = async (templateData: Partial<Template>) => {
    if (!companyId) {
      console.error('Company ID is required to create a template');
      return;
    }

    try {
      const newTemplate: Template = {
        id: nanoid(),
        name: templateData.name || '',
        questions: templateData.questions || [],
        company_id: companyId,
        sections: [],
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('templates')
        .insert([newTemplate]);

      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Templates
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsConfigOpen(true)}
          className="fixed top-4 right-4 z-10"
        >
          <Settings className="h-4 w-4 mr-2" />
          General Configurations
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Template</h1>

        <CreateTemplateForm 
          template={{
            id: nanoid(),
            name: '',
            questions: [],
            company_id: companyId,
            sections: [],
            created_at: new Date().toISOString(),
          }}
          onSave={handleSubmit}
          mode="create"
        />
      </div>

      <ConfigurationModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
}