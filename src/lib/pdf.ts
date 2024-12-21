import { jsPDF } from 'jspdf';
import type { Inspection, Template } from '../types';
import { formatDate } from './utils';
import { supabase } from './supabase/client';

export async function generatePDF(inspection: Inspection, template: Template) {
  try {
    // Fetch company name
    const { data: companyData } = await supabase
      .from('companies')
      .select('name')
      .eq('id', inspection.company_id)
      .single();

    const companyName = companyData?.name || 'N/A';
    
    const doc = new jsPDF();
    let yPos = 20;
    const maxWidth = 170;

    // Helper function for text wrapping and pagination
    const addWrappedText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxWidth);
      
      // Check if we need a new page
      if (yPos + (lines.length * (fontSize / 2)) > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(lines, 20, yPos);
      yPos += (lines.length * (fontSize / 2)) + 5;
    };

    // Add title and company info
    addWrappedText('Inspection Report', 20, true);
    addWrappedText(`Company: ${companyName}`, 14);

    // Rest of your code remains the same...
    addWrappedText(`Template: ${template.name}`);
    addWrappedText(`Inspector: ${inspection.inspectorName}`);
    addWrappedText(`Location: ${inspection.location}`);
    addWrappedText(`Date: ${formatDate(inspection.date)}`);
    addWrappedText(`Status: ${inspection.status}`);
    yPos += 10;

    // Add responses header
    addWrappedText('Responses', 16, true);
    yPos += 5;

    // Process each question and response
    for (const question of template.questions) {
      const response = inspection.responses[question.id];

      // Add question
      addWrappedText(question.question, 12, true);

      // Process response based on type
      try {
        switch (question.type) {
          case 'text':
            addWrappedText(response || 'No response');
            break;

          case 'multipleChoice':
            addWrappedText(response || 'No selection');
            break;

          case 'checkbox':
            if (Array.isArray(response) && response.length > 0) {
              response.forEach((item: string) => {
                addWrappedText(`• ${item}`);
              });
            } else {
              addWrappedText('No selections');
            }
            break;

          case 'photo':
            if (response) {
              try {
                const img = new Image();
                img.src = response;
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
                });

                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                
                if (ctx) {
                  ctx.drawImage(img, 0, 0);
                  const imgData = canvas.toDataURL('image/jpeg', 0.75);
                  const imgProps = doc.getImageProperties(imgData);
                  const pdfWidth = 150;
                  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                  if (yPos + pdfHeight > 270) {
                    doc.addPage();
                    yPos = 20;
                  }

                  doc.addImage(imgData, 'JPEG', 20, yPos, pdfWidth, pdfHeight);
                  yPos += pdfHeight + 10;
                }
              } catch (error) {
                console.error('Error processing photo:', error);
                addWrappedText('Error loading photo');
              }
            } else {
              addWrappedText('No photo uploaded');
            }
            break;

          case 'signature':
            if (response) {
              try {
                const imgProps = doc.getImageProperties(response);
                const pdfWidth = 100;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                if (yPos + pdfHeight > 270) {
                  doc.addPage();
                  yPos = 20;
                }

                doc.addImage(response, 'PNG', 20, yPos, pdfWidth, pdfHeight);
                yPos += pdfHeight + 10;
              } catch (error) {
                console.error('Error processing signature:', error);
                addWrappedText('Error loading signature');
              }
            } else {
              addWrappedText('No signature provided');
            }
            break;
        }
      } catch (error) {
        console.error(`Error processing question ${question.id}:`, error);
        addWrappedText('Error processing response');
      }

      yPos += 10;
    }

    // Add footer with timestamp
    const footer = `Generated on ${new Date().toLocaleString()}`;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(footer, 20, 280);

    // Save the PDF
    doc.save(`inspection-${inspection.id}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}