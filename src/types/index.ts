// src/types/index.ts

export interface Question {
  id: string;
  type: 'text' | 'multipleChoice' | 'checkbox' | 'photo' | 'signature';
  question: string; // Keep this as 'question' since that's what your code uses
  required: boolean;
  options?: string[];
}

export interface Template {
  id: string;
  name: string;
  company_id: string;
  questions: Question[];
  sections: any[]; // jsonb
  created_at?: string;
}

export interface Inspection {
  id: string;
  template_id: string | null;
  company_id: string;
  inspector_name: string;
  status: string;
  date: Date;
  location: string;
  responses: Record<string, any>;
  duplicated_sections: any[];
}