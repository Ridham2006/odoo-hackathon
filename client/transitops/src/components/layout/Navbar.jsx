import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLE_LABELS, ROLE_ICONS } from '../../context/AuthContext';
import { Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const RoleIcon = ROLE_ICONS[user.role];

  return (
    <header className="h-20 bg-white border-b border-[var(--card)] flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-[var(--text)]">TransitOps</h2>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium">
          <RoleIcon className="w-4 h-4" />
          {ROLE_LABELS[user.role]}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link 
          to="/settings" 
          className="p-2 rounded-xl text-[var(--text)]/60 hover:bg-[var(--card)] hover:text-[var(--text)] transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" strokeWidth={1.5} />
        </Link>

        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--card)] hover:bg-[var(--card)]/80 transition-colors cursor-pointer" onClick={handleLogout}>
          <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-[var(--text)]">{user.name}</p>
            <p className="text-xs text-[var(--text)]/50">{user.email}</p>
          </div>
          <LogOut className="w-4 h-4 text-[var(--text)]/50" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
