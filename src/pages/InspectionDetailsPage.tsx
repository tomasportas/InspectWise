import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useInspectionStore } from '../store/inspectionStore';
import { useTemplateStore } from '../store/templateStore';
import { formatDate } from '../lib/utils';

interface InspectionDetailsPageProps {
  companyId: string;
}

export function InspectionDetailsPage({ companyId }: InspectionDetailsPageProps) {
  const navigate = useNavigate();
  const { inspectionId } = useParams();
  const { inspections, fetchInspections, loading, error } = useInspectionStore();
  const { templates, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    fetchInspections(companyId);
    fetchTemplates(companyId);
  }, [companyId, fetchInspections, fetchTemplates]);

  const inspection = inspections.find((i) => i.id === inspectionId);
  const template = inspection 
    ? templates.find((t) => t.id === inspection.template_id)
    : null;

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!inspection || !template) {
    return (
      <div className="p-4">
        <div className="mb-4">Inspection not found</div>
        <Button variant="outline" onClick={() => navigate('/inspections')}>
          Back to Inspections
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate('/inspections')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inspections
        </Button>
      </div>

      <div className="space-y-6">
        <h1 className="text-2xl font-bold">
          {template.name}
        </h1>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Inspector</p>
            <p className="font-medium">{inspection.inspector_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{inspection.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{formatDate(inspection.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{inspection.status}</p>
          </div>
        </div>

        <div className="space-y-8">
          {template.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <h3 className="font-medium">{question.question}</h3>
              {renderResponse(question, inspection.responses[question.id])}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const renderResponse = (question: any, value: any) => {
  switch (question.type) {
    case 'text':
      return <p className="text-gray-900">{value || 'No response'}</p>;
    case 'multipleChoice':
      return <p className="text-gray-900">{value || 'No selection'}</p>;
    case 'checkbox':
      return (
        <ul className="list-disc list-inside text-gray-900">
          {value && value.length > 0 ? (
            value.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))
          ) : (
            <li>No selections</li>
          )}
        </ul>
      );
    case 'photo':
      return value ? (
        <img
          src={value}
          alt="Inspection photo"
          className="max-w-md rounded-lg"
        />
      ) : (
        <p className="text-gray-500">No photo uploaded</p>
      );
    case 'signature':
      return value ? (
        <img
          src={value}
          alt="Signature"
          className="max-w-md border rounded-lg"
        />
      ) : (
        <p className="text-gray-500">No signature provided</p>
      );
    default:
      return <p className="text-gray-500">Unsupported response type</p>;
  }
};