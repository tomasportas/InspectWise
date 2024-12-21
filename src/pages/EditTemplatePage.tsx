// src/pages/EditTemplatePage.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CreateTemplateForm } from '../components/forms/CreateTemplateForm';
import { ConfigurationModal } from '../components/forms/configuration/ConfigurationModal';
import { useTemplateStore } from '../store/templateStore';
import { Template } from '../types';

interface EditTemplatePageProps {
  companyId: string;
}

export function EditTemplatePage({ companyId }: EditTemplatePageProps) {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { templates, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    fetchTemplates(companyId);
  }, [companyId, fetchTemplates]);

  const template = templates.find((t) => t.id === templateId);

  if (!template) {
    return <div>Template not found</div>;
  }

  const handleSave = async (updatedTemplate: Pick<Template, 'name' | 'questions'>) => {
    try {
      await useTemplateStore.getState().updateTemplate(templateId!, updatedTemplate, companyId);
      navigate('/');
    } catch (error) {
      console.error('Error updating template:', error);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Template</h1>
        <CreateTemplateForm
          template={template}
          onSave={handleSave}
          mode="edit"
        />
      </div>

      <ConfigurationModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
}