// src/components/forms/CreateTemplateForm.tsx

import { useState, FormEvent } from 'react';
import { nanoid } from 'nanoid';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuestionList } from './QuestionList';
import { useTemplateStore } from '../../store/templateStore';
import { useAuth } from '../../context/AuthContext';
import type { Question, Template } from '../../types';

interface CreateTemplateFormProps {
  template?: Template;
  onSave?: (template: Pick<Template, 'name' | 'questions'>) => Promise<void>;
  mode?: 'create' | 'edit';
}

export function CreateTemplateForm({ template, onSave, mode = 'create' }: CreateTemplateFormProps) {
  const { company } = useAuth();
  const [name, setName] = useState(template?.name || '');
  const [questions, setQuestions] = useState<Question[]>(template?.questions || []);
  const [error, setError] = useState<string | null>(null);
  const { addTemplate, updateTemplate } = useTemplateStore();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: nanoid(),
        type: 'text',
        question: '',
        required: false,
      },
    ]);
  };

  const handleQuestionChange = (index: number, question: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Starting template submission');

    if (!company?.id) {
      console.error('No company ID found:', company);
      setError('No company associated with your account. Please try logging in again.');
      return;
    }

    try {
      console.log('Preparing template data:', {
        name,
        questions,
        companyId: company.id
      });

      const templateData = {
        name,
        questions,
      };

      if (template) {
        console.log('Updating existing template:', template.id);
        await updateTemplate(template.id, templateData, company.id);
        console.log('Template updated successfully');
      } else {
        console.log('Creating new template');
        await addTemplate(templateData, company.id);
        console.log('Template created successfully');
      }

      console.log('Template save complete');
      onSave?.({ name, questions });
    } catch (err) {
      console.error('Detailed error saving template:', err);
      if (err instanceof Error) {
        setError(`Failed to save template: ${err.message}`);
      } else {
        setError('Failed to save template. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Template Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Questions</h3>
        <QuestionList
          questions={questions}
          onQuestionsChange={setQuestions}
          onRemoveQuestion={handleRemoveQuestion}
          onQuestionChange={handleQuestionChange}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 p-4 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            type="button"
            onClick={handleAddQuestion}
            variant="secondary"
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
          <Button type="submit" disabled={questions.length === 0}>
            {mode === 'edit' ? 'Update' : 'Create'} Template
          </Button>
        </div>
      </div>
    </form>
  );
}