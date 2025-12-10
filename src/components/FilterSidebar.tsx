import { useState } from 'react';

interface Topic {
  id: string;
  name: string;
}

interface FilterSidebarProps {
  topics: Topic[];
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({
  topics,
  selectedTopics,
  onTopicsChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortChange,
  isOpen = true,
  onClose
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['date', 'topics', 'sort']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      onTopicsChange(selectedTopics.filter(t => t !== topicId));
    } else {
      onTopicsChange([...selectedTopics, topicId]);
    }
  };

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:relative top-0 lg:top-0 left-0 z-50 lg:z-0
        w-80 lg:w-full max-h-screen lg:max-h-none overflow-y-auto
        bg-white lg:bg-white/80 lg:backdrop-blur-lg
        border-r lg:border-none lg:rounded-2xl
        shadow-xl lg:shadow-card
        transform transition-transform duration-300 lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Clear all filters */}
          {(selectedTopics.length > 0 || dateFilter !== 'all') && (
            <button
              onClick={() => {
                onTopicsChange([]);
                onDateFilterChange('all');
              }}
              className="w-full py-2 px-4 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Clear all filters
            </button>
          )}

          {/* Sort Section */}
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('sort')}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-semibold text-gray-900">Sort By</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.has('sort') ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.has('sort') && (
              <div className="px-4 pb-4 space-y-2">
                {sortOptions.map(option => (
                  <label 
                    key={option.value}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      sortBy === option.value ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => onSortChange(e.target.value)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter Section */}
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('date')}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-semibold text-gray-900">Date</span>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.has('date') ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.has('date') && (
              <div className="px-4 pb-4 space-y-2">
                {dateFilters.map(filter => (
                  <label 
                    key={filter.value}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      dateFilter === filter.value ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="date"
                      value={filter.value}
                      checked={dateFilter === filter.value}
                      onChange={(e) => onDateFilterChange(e.target.value)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium">{filter.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Topics Section */}
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('topics')}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Topics</span>
                {selectedTopics.length > 0 && (
                  <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                    {selectedTopics.length}
                  </span>
                )}
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.has('topics') ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.has('topics') && (
              <div className="px-4 pb-4 space-y-2 max-h-80 overflow-y-auto">
                {topics.map(topic => (
                  <label 
                    key={topic.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTopics.includes(topic.id) ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic.id)}
                      onChange={() => toggleTopic(topic.id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium flex-1">{topic.name}</span>
                  </label>
                ))}
                {topics.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No topics yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
