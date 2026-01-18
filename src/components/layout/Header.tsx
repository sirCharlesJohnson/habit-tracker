import { Link } from 'react-router-dom';
import { Brain, Moon, Sun } from 'lucide-react';
import { useUIStore } from '../../store';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useUIStore();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">Habit Tracker</span>
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
