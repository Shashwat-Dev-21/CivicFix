import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-10 bg-slate-800 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Civic<span className="text-blue-400">Fix</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="text-slate-300">Hi, {user.name}</span>
              <Link
                to="/create"
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                Report Issue
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-blue-400 transition-colors">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-slate-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;