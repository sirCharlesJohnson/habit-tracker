import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { HABIT_ICONS } from '../../utils/constants';

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  color?: string;
}

export default function IconPicker({ value, onChange, color = '#6b7280' }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = HABIT_ICONS.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
    return Icon || LucideIcons.Circle;
  };

  const SelectedIcon = value ? getIcon(value) : LucideIcons.Plus;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Icon
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 w-full border-2 rounded-lg transition-colors hover:bg-gray-50"
        style={{ borderColor: value ? color : '#e5e7eb' }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <SelectedIcon size={24} style={{ color }} />
        </div>
        <span className="text-gray-700">
          {value || 'Choose an icon'}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />

            {/* Icons Grid */}
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {filteredIcons.map((iconName) => {
                const Icon = getIcon(iconName);
                const isSelected = value === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      isSelected
                        ? 'bg-primary-100 ring-2 ring-primary-500'
                        : 'hover:bg-gray-100'
                    }`}
                    title={iconName}
                  >
                    <Icon
                      size={20}
                      style={{ color: isSelected ? color : '#6b7280' }}
                    />
                  </button>
                );
              })}
            </div>

            {filteredIcons.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-4">
                No icons found
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Helper component to render a habit icon by name
export function HabitIcon({
  name,
  size = 20,
  color = '#6b7280',
  className = ''
}: {
  name?: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  if (!name) return null;

  const Icon = LucideIcons[name as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
  if (!Icon) return null;

  return <Icon size={size} color={color} className={className} />;
}
