import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Habit, HabitFrequency } from '../../types';
import { useHabitStore } from '../../store';
import { toast } from '../../store/toastStore';
import { HABIT_CATEGORIES, HABIT_COLORS, DAYS_OF_WEEK } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';
import IconPicker from '../common/IconPicker';

const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(50, 'Name is too long'),
  description: z.string().max(200, 'Description is too long').optional(),
  category: z.enum(['health', 'productivity', 'learning', 'mindfulness', 'social', 'custom']),
  frequency: z.enum(['daily', 'weekly', 'custom']),
  targetDays: z.array(z.number()).optional(),
  color: z.string(),
  icon: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitFormProps {
  habit?: Habit;
  onClose: () => void;
}

export default function HabitForm({ habit, onClose }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabitStore();
  const isEditing = !!habit;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: habit || {
      name: '',
      description: '',
      category: 'health',
      frequency: 'daily',
      targetDays: [],
      color: HABIT_COLORS[0],
      icon: '',
    },
  });

  const selectedFrequency = watch('frequency');
  const selectedColor = watch('color');
  const selectedIcon = watch('icon');
  const selectedDays = watch('targetDays') || [];

  const onSubmit = (data: HabitFormData) => {
    if (isEditing) {
      updateHabit(habit.id, data);
      toast.success(`Updated habit: ${data.name}`);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
        archived: false,
      };
      addHabit(newHabit);
      toast.success(`Created habit: ${data.name}`);
    }
    onClose();
  };

  const toggleDay = (day: number) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue('targetDays', newDays);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Habit Name */}
      <Input
        label="Habit Name"
        placeholder="e.g., Morning Meditation"
        error={errors.name?.message}
        required
        {...register('name')}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          rows={3}
          placeholder="Optional description..."
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Icon & Color Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Icon Picker */}
        <IconPicker
          value={selectedIcon}
          onChange={(icon) => setValue('icon', icon)}
          color={selectedColor}
        />

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {HABIT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                  selectedColor === color ? 'ring-4 ring-primary-300 scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {HABIT_CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              className="flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
              style={{
                borderColor: watch('category') === cat.value ? cat.color : '#e5e7eb',
                backgroundColor: watch('category') === cat.value ? `${cat.color}10` : 'white',
              }}
            >
              <input
                type="radio"
                value={cat.value}
                className="sr-only"
                {...register('category')}
              />
              <span className="text-sm font-medium">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frequency <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'custom'] as HabitFrequency[]).map((freq) => (
            <label
              key={freq}
              className={`flex-1 p-3 border-2 rounded-lg cursor-pointer text-center transition-colors hover:bg-gray-50 ${
                selectedFrequency === freq
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                value={freq}
                className="sr-only"
                {...register('frequency')}
              />
              <span className="text-sm font-medium capitalize">{freq}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Weekly Days Selection */}
      {selectedFrequency === 'weekly' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Days
          </label>
          <div className="flex space-x-1">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`flex-1 py-2 px-1 text-xs font-medium rounded-lg transition-colors ${
                  selectedDays.includes(day.value)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.short}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Update Habit' : 'Create Habit'}
        </Button>
      </div>
    </form>
  );
}
