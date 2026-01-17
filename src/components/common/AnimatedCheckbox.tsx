import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function AnimatedCheckbox({
  checked,
  onChange,
  size = 'md',
  disabled = false,
}: AnimatedCheckboxProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
    >
      <motion.div
        className={`${sizeClasses[size]} rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
          checked
            ? 'bg-primary-600 border-primary-600'
            : 'bg-white border-gray-300 hover:border-primary-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        animate={{
          scale: checked ? [1, 1.2, 1] : 1,
          rotate: checked ? [0, 360] : 0,
        }}
        transition={{
          duration: 0.3,
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <Check className="text-white" size={iconSizes[size]} strokeWidth={3} />
        </motion.div>
      </motion.div>
    </button>
  );
}
