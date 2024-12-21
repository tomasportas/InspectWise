import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
  address: string;
  created_at: string;
}

export const SettingsPage: React.FC<{ companyId: string }> = ({ companyId }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id, name, address, created_at')
          .eq('id', companyId)
          .single();

        if (companyError) {
          throw new Error(`Error fetching company details: ${companyError.message}`);
        }

        setCompany(companyData);

        // Fetch users associated with the company
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('company_id', companyId);

        if (usersError) {
          throw new Error(`Error fetching users: ${usersError.message}`);
        }

        setUsers(usersData || []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) {
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
      {/* Company Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900">Company Details</h2>
        <p className="mt-2 text-sm text-gray-600">Name: {company?.name}</p>
        <p className="text-sm text-gray-600">Address: {company?.address}</p>
        <p className="text-sm text-gray-600">
          Created At: {company?.created_at ? new Date(company.created_at).toLocaleDateString() : 'N/A'}
        </p>
      </div>

      {/* Users List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900">Users</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="mt-2 text-sm text-gray-600">No users found for this company.</p>
        )}
      </div>
    </div>
  );
};
