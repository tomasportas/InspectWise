import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FileSpreadsheet, ClipboardList, Menu, Home, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase/client';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { companyId } = useAuth();
  const [companyName, setCompanyName] = useState<string>('InspectWise');

  // Updated Navigation Items
  const navItems: NavItem[] = [
    { to: '/home', label: 'Home', icon: Home }, // Navigate to HomePage
    { to: '/templates', label: 'Templates', icon: FileSpreadsheet }, // Navigate to TemplatesPage
    { to: '/inspections', label: 'Inspections', icon: ClipboardList }, // Navigate to InspectionsPage
    { to: '/settings', label: 'Settings', icon: Settings },
  ];
  

  useEffect(() => {
    async function fetchCompanyName() {
      if (!companyId) return;

      try {
        const { data, error } = await supabase
          .from('companies')
          .select('name')
          .eq('id', companyId)
          .single();

        if (error) throw error;
        if (data?.name) {
          setCompanyName(data.name);
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
      }
    }

    fetchCompanyName();
  }, [companyId]);

  const NavItems = () => (
    <>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-md',
              'transition-colors duration-150 ease-in-out',
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <NavItems />
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">{companyName}</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-600 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                  <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
                </div>
                <nav className="mt-8 flex-1 px-2 space-y-1">
                  <NavItems />
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
