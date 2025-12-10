import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { SermonCard } from './components/SermonCard';
import { FilterBar } from './components/FilterBar';
import { sermonService } from './services/sermonService';
import { supabase } from './lib/supabase';
import type { Sermon } from './types';

interface Topic {
  id: string;
  name: string;
}

interface SermonSeries {
  id: string;
  name: string;
  description?: string;
}

function App() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sermonSeries, setSermonSeries] = useState<SermonSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch sermons, topics, and series from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const [sermonsData, topicsData, seriesData] = await Promise.all([
          sermonService.getSermons(),
          supabase.from('topics').select('*').order('name'),
          supabase.from('sermon_series').select('*').order('name')
        ]);
        
        setSermons(sermonsData);
        if (topicsData.data) setTopics(topicsData.data);
        if (seriesData.data) setSermonSeries(seriesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter and sort sermons
  const filteredSermons = useMemo(() => {
    let result = [...sermons];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sermon => 
        sermon.title.toLowerCase().includes(query) ||
        sermon.summary.toLowerCase().includes(query) ||
        sermon.keyTopics.some(topic => topic.toLowerCase().includes(query)) ||
        sermon.pastorName.toLowerCase().includes(query) ||
        sermon.scriptureReferences.some(ref => 
          `${ref.book} ${ref.chapter}`.toLowerCase().includes(query)
        )
      );
    }

    // Topic filter
    if (selectedTopics.length > 0) {
      const selectedTopicNames = selectedTopics.map(id => 
        topics.find(t => t.id === id)?.name.toLowerCase() || ''
      );
      result = result.filter(sermon =>
        sermon.keyTopics.some(topic => 
          selectedTopicNames.some(selectedTopic => 
            topic.toLowerCase().includes(selectedTopic) || 
            selectedTopic.includes(topic.toLowerCase())
          )
        )
      );
    }

    // Series filter
    if (selectedSeries) {
      result = result.filter(sermon => sermon.seriesName === selectedSeries);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateFilter) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case '2024':
          startDate = new Date(2024, 0, 1);
          result = result.filter(sermon => {
            const sermonDate = new Date(sermon.datePreached);
            return sermonDate.getFullYear() === 2024;
          });
          break;
        case '2023':
          result = result.filter(sermon => {
            const sermonDate = new Date(sermon.datePreached);
            return sermonDate.getFullYear() === 2023;
          });
          break;
        default:
          startDate = new Date(0);
      }

      if (!['2024', '2023'].includes(dateFilter)) {
        result = result.filter(sermon => new Date(sermon.datePreached) >= startDate);
      }
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.datePreached).getTime() - new Date(a.datePreached).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.datePreached).getTime() - new Date(b.datePreached).getTime());
        break;
      case 'views':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [sermons, searchQuery, selectedTopics, selectedSeries, dateFilter, sortBy, topics]);

  return (
    <div className="min-h-screen">
      <Header onSearch={setSearchQuery} />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {sermonSeries.length > 0 ? sermonSeries[0].name : 'New sermons every week'}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Discover God's Word
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Explore our archive of sermons, find messages that speak to your season, and grow deeper in your faith journey.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary-400">
                {sermons.length}+
              </div>
              <div className="text-white/70 text-sm">Sermons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary-400">
                {topics.length}
              </div>
              <div className="text-white/70 text-sm">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary-400">
                {sermonSeries.length}
              </div>
              <div className="text-white/70 text-sm">Series</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="sermons" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <FilterBar
          topics={topics}
          sermonSeries={sermonSeries}
          selectedTopics={selectedTopics}
          onTopicsChange={setSelectedTopics}
          selectedSeries={selectedSeries}
          onSeriesChange={setSelectedSeries}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedSeries ? (
              <>Series: <span className="text-primary-600">{selectedSeries}</span></>
            ) : searchQuery ? (
              <>Showing results for "<span className="text-primary-600">{searchQuery}</span>"</>
            ) : (
              'All Sermons'
            )}
            <span className="text-gray-500 font-normal ml-2">({filteredSermons.length})</span>
          </h3>
        </div>

            {/* Grid */}
            {filteredSermons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSermons.map((sermon) => (
                  <SermonCard
                    key={sermon.id}
                    sermon={sermon}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No sermons found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
      </main>

      {/* Footer */}
      <footer className="glass-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">First Baptist Church</h3>
                <p className="text-white/70 text-sm">Sermon Archive</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">About</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Contact</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Give</a>
            </div>

            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} First Baptist Church
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
