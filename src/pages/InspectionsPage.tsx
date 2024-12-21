// src/pages/InspectionsPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useInspectionStore } from '../store/inspectionStore';
import { useTemplateStore } from '../store/templateStore';
import { formatDate } from '../lib/utils';
import { generatePDF } from '../lib/pdf';

interface InspectionsPageProps {
  companyId: string;
}

export function InspectionsPage({ companyId }: InspectionsPageProps) {
  const navigate = useNavigate();
  const { inspections, fetchInspections, loading: inspectionsLoading } = useInspectionStore();
  const { templates, fetchTemplates, loading: templatesLoading } = useTemplateStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!companyId) {
        console.error('No company ID found');
        return;
      }

      try {
        console.log("Fetching data for company:", companyId);
        await Promise.all([
          fetchInspections(companyId),
          fetchTemplates(companyId) // Ensure templates are fetched
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load inspections data');
      }
    };

    loadData();
  }, [companyId, fetchInspections, fetchTemplates]);

  const filteredInspections = inspections.filter(
    (inspection) =>
      inspection.inspector_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = async (inspection: typeof inspections[0]) => {
    try {
      const template = templates.find((t) => t.id === inspection.template_id);
      if (!template) {
        console.error('Template not found for inspection:', inspection.id);
        return;
      }
      await generatePDF(inspection, template);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
    }
  };

  const handleDownloadAll = async () => {
    try {
      for (const inspection of filteredInspections) {
        const template = templates.find((t) => t.id === inspection.template_id);
        if (template) {
          await generatePDF(inspection, template);
        }
      }
    } catch (err) {
      console.error('Error generating PDFs:', err);
      setError('Failed to generate PDFs');
    }
  };

  if (inspectionsLoading || templatesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
        <button 
          onClick={() => setError(null)}
          className="ml-2 text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
        <Button 
          variant="secondary" 
          className="space-x-2"
          onClick={handleDownloadAll}
          disabled={filteredInspections.length === 0}
        >
          <Download className="h-4 w-4" />
          <span>Export All</span>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search inspections..."
          className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inspector
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInspections.map((inspection) => (
              <tr key={inspection.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(inspection.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {inspection.inspector_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {inspection.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      inspection.status === 'complete'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {inspection.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleDownloadPDF(inspection)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/inspections/${inspection.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
            {filteredInspections.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No inspections found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
