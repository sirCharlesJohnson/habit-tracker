import { useState, useMemo } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import { useJournalStore, useUIStore } from '../store';
import { formatDate } from '../utils/dateUtils';
import JournalList from '../components/journal/JournalList';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import MoodInput from '../components/journal/MoodInput';

export default function Journal() {
  const { entries, getEntryById } = useJournalStore();
  const { isJournalModalOpen, editingJournalId, openJournalModal, closeJournalModal } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  // Filter entries based on search and date
  const filteredEntries = useMemo(() => {
    return sortedEntries.filter((entry) => {
      // Text search in content
      const matchesSearch = searchQuery === '' ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.sentiment?.themes?.some(theme =>
          theme.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Date filter
      const matchesDate = filterDate === '' || entry.date === filterDate;

      return matchesSearch && matchesDate;
    });
  }, [sortedEntries, searchQuery, filterDate]);

  const editingEntry = editingJournalId ? getEntryById(editingJournalId) : undefined;

  // Get unique dates for filter dropdown
  const uniqueDates = useMemo(() => {
    const dates = [...new Set(sortedEntries.map(e => e.date))];
    return dates.slice(0, 30); // Show last 30 unique dates
  }, [sortedEntries]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
            <p className="text-gray-600 mt-2">
              Reflect on your day and track your mood
            </p>
          </div>
          <Button onClick={() => openJournalModal()}>
            <Plus size={18} className="mr-2" />
            New Entry
          </Button>
        </div>

        {/* Stats */}
        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {entries.filter(e => {
                  const entryMonth = new Date(e.date).getMonth();
                  const currentMonth = new Date().getMonth();
                  return entryMonth === currentMonth;
                }).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Analyzed</p>
              <p className="text-2xl font-bold text-gray-900">
                {entries.filter(e => e.sentiment).length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {entries.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">All Dates</option>
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || filterDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterDate('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Journal Entries */}
      {filteredEntries.length > 0 ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </p>
          <JournalList entries={filteredEntries} />
        </>
      ) : entries.length > 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">No entries match your filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterDate('');
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No journal entries yet. Start writing!</p>
          <Button onClick={() => openJournalModal()}>
            <Plus size={18} className="mr-2" />
            Create Your First Entry
          </Button>
        </div>
      )}

      {/* Journal Modal */}
      <Modal
        isOpen={isJournalModalOpen}
        onClose={closeJournalModal}
        title={editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
        size="lg"
      >
        <MoodInput entry={editingEntry} onClose={closeJournalModal} />
      </Modal>
    </div>
  );
}
