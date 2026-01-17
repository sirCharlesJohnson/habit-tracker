import { motion } from 'framer-motion';
import type { JournalEntry as JournalEntryType } from '../../types';
import JournalEntry from './JournalEntry';

interface JournalListProps {
  entries: JournalEntryType[];
}

export default function JournalList({ entries }: JournalListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No journal entries yet. Start writing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <JournalEntry entry={entry} />
        </motion.div>
      ))}
    </div>
  );
}
