import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="h-full min-h-screen bg-gray-50">
      {/* Fixed Header at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="md:pl-64 pt-16">
        <main className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Outlet /> {/* Renders active route's content */}
          </div>
        </main>
      </div>
    </div>
  );
}
