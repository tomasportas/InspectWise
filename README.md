chat# InspectWise MVP

A web-based inspection management system built with React, TypeScript, and Supabase.

## Features

- Template Creation & Management
- Digital Inspections
- PDF Report Generation
- User Authentication & Authorization
- Company-based Access Control
- Digital Signatures
- Photo Upload Support

## Tech Stack

- Frontend: React + TypeScript
- Build Tool: Vite
- State Management: Zustand
- Styling: Tailwind CSS
- Backend/Database: Supabase
- File Storage: Supabase Storage
- Authentication: Supabase Auth

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/inspectwise-mvp.git
cd inspectwise-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Project Structure

```
MVPinspectWise2.0/
├── src/
│   ├── components/     # Reusable UI components
│   ├── store/         # Zustand state management
│   ├── lib/           # Utility functions and configurations
│   ├── types/         # TypeScript type definitions
│   ├── hooks/         # Custom React hooks
│   ├── assets/        # Static assets
│   └── styles/        # Global styles
```

## Database Schema

### Templates
- id: uuid
- name: string
- questions: jsonb
- created_at: timestamp
- company_id: uuid (foreign key)

### Inspections
- id: uuid
- template_id: uuid (foreign key)
- inspector_name: string
- status: string
- date: timestamp
- location: string
- responses: jsonb
- company_id: uuid (foreign key)

### Companies
- id: uuid
- name: string
- created_at: timestamp

## Key Components

- Template Management: Create and manage inspection templates
- Inspection Forms: Conduct inspections using templates
- Company Management: Multi-tenant support
- User Authentication: Secure access control
- PDF Generation: Create professional reports

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
