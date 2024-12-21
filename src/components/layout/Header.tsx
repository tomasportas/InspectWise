import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, company, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(); // Clear session and local storage
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="w-full px-4 py-3 flex justify-between items-center">
        <div className="font-medium text-gray-900">
          {company ? (
            <span>{company.name}</span>
          ) : (
            <span className="text-gray-400">Company Name</span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="text-sm text-gray-700">{user.email}</div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};