import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTemplateStore } from '../store/templateStore';

interface TemplatesPageProps {
  companyId: string | null;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ companyId }) => {
  const { templates, loading, error, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    if (companyId) fetchTemplates(companyId); // Ensure fetchTemplates takes companyId
  }, [companyId, fetchTemplates]);

  if (loading) {
    return <div>Loading templates...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Link
          to="/templates/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Template
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
            <p className="text-gray-600 mb-4">
              {template.questions.length} questions
            </p>
            <div className="flex space-x-2">
              <Link
                to={`/templates/${template.id}/edit`}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </Link>
              <Link
                to={`/templates/${template.id}/inspect`}
                className="text-green-500 hover:text-green-700"
              >
                Start Inspection
              </Link>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No templates found. Create your first template to get started.
        </div>
      )}
    </div>
  );
};
