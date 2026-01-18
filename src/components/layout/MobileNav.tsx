import { NavLink } from 'react-router-dom';
import { Home, ListTodo, BookOpen, BarChart3, Trophy, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Today', icon: Home },
  { to: '/habits', label: 'Habits', icon: ListTodo },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
  { to: '/achievements', label: 'Badges', icon: Trophy },
  { to: '/coaching', label: 'AI', icon: Sparkles },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 pb-safe">
      <div className="grid grid-cols-6 h-16">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
