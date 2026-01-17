import { NavLink } from 'react-router-dom';
import { Home, ListTodo, BookOpen, BarChart3, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Today', icon: Home },
  { to: '/habits', label: 'Habits', icon: ListTodo },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
  { to: '/coaching', label: 'Coaching', icon: Sparkles },
];

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
