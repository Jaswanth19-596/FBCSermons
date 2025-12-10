import { useState, useRef, useEffect } from 'react';

interface Topic {
  id: string;
  name: string;
}

interface SermonSeries {
  id: string;
  name: string;
}

interface FilterBarProps {
  topics: Topic[];
  sermonSeries: SermonSeries[];
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  selectedSeries: string | null;
  onSeriesChange: (series: string | null) => void;
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function FilterBar({
  topics,
  sermonSeries,
  selectedTopics,
  onTopicsChange,
  selectedSeries,
  onSeriesChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortChange
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    { value: 'alphabetical', label: 'A-Z' },
  ];

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      onTopicsChange(selectedTopics.filter(t => t !== topicId));
    } else {
      onTopicsChange([...selectedTopics, topicId]);
    }
  };

  const clearAllFilters = () => {
    onTopicsChange([]);
    onSeriesChange(null);
    onDateFilterChange('all');
    onSortChange('recent');
  };

  const hasActiveFilters = selectedTopics.length > 0 || selectedSeries || dateFilter !== 'all';

  return (
    <div ref={dropdownRef} className="bg-white rounded-xl shadow-card p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Series Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'series' ? null : 'series')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              selectedSeries 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {selectedSeries || 'Series'}
            <svg className={`w-4 h-4 transition-transform ${openDropdown === 'series' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openDropdown === 'series' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto">
              <button
                onClick={() => { onSeriesChange(null); setOpenDropdown(null); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!selectedSeries ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
              >
                All Series
              </button>
              {sermonSeries.map(series => (
                <button
                  key={series.id}
                  onClick={() => { onSeriesChange(series.name); setOpenDropdown(null); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedSeries === series.name ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'}`}
                >
                  {series.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Topics Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'topics' ? null : 'topics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              selectedTopics.length > 0 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Topics {selectedTopics.length > 0 && `(${selectedTopics.length})`}
            <svg className={`w-4 h-4 transition-transform ${openDropdown === 'topics' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openDropdown === 'topics' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto">
              {topics.length === 0 ? (
                <p className="px-4 py-2 text-sm text-gray-500">No topics yet</p>
              ) : (
                topics.map(topic => (
                  <label
                    key={topic.id}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic.id)}
                      onChange={() => toggleTopic(topic.id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{topic.name}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              dateFilter !== 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dateFilters.find(d => d.value === dateFilter)?.label || 'Date'}
            <svg className={`w-4 h-4 transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openDropdown === 'date' && (
            <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {dateFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => { onDateFilterChange(filter.value); setOpenDropdown(null); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${dateFilter === filter.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            {sortOptions.find(s => s.value === sortBy)?.label || 'Sort'}
            <svg className={`w-4 h-4 transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openDropdown === 'sort' && (
            <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => { onSortChange(option.value); setOpenDropdown(null); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === option.value ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear All */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="ml-auto flex items-center gap-1 px-3 py-2 text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
