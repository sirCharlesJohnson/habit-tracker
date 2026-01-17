import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { HABIT_TEMPLATE_CATEGORIES, type HabitTemplate } from '../../utils/habitTemplates';
import { useHabitStore } from '../../store';
import { toast } from '../../store/toastStore';
import { HabitIcon } from '../common/IconPicker';
import type { Habit } from '../../types';

interface HabitTemplatesProps {
  onSelect?: () => void;
}

export default function HabitTemplates({ onSelect }: HabitTemplatesProps) {
  const { addHabit } = useHabitStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    HABIT_TEMPLATE_CATEGORIES[0]?.name || null
  );

  const handleSelectTemplate = (template: HabitTemplate) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: template.name,
      description: template.description,
      category: template.category,
      frequency: template.frequency,
      targetDays: template.targetDays,
      color: template.color,
      icon: template.icon,
      createdAt: new Date().toISOString(),
      archived: false,
    };

    addHabit(newHabit);
    toast.success(`Added habit: ${template.name}`);
    onSelect?.();
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-4">
        Choose from pre-built habits to get started quickly
      </p>

      {HABIT_TEMPLATE_CATEGORIES.map((category) => (
        <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category.name)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{category.emoji}</span>
              <span className="font-medium text-gray-900">{category.name}</span>
              <span className="text-xs text-gray-500">
                ({category.templates.length})
              </span>
            </div>
            {expandedCategory === category.name ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Templates List */}
          {expandedCategory === category.name && (
            <div className="divide-y divide-gray-100">
              {category.templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${template.color}20` }}
                    >
                      <HabitIcon
                        name={template.icon}
                        size={20}
                        color={template.color}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectTemplate(template)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    aria-label={`Add ${template.name}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
