import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sermonService } from '../services/sermonService';
import { supabase } from '../lib/supabase';
import { AdminLayout } from './AdminLayout';

// Bible books data
const OLD_TESTAMENT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
];

const NEW_TESTAMENT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
  '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

interface Topic {
  id: string;
  name: string;
}

interface SermonSeries {
  id: string;
  name: string;
  description?: string;
}

interface ScriptureReference {
  book: string;
  chapter: number;
  verses: string;
}

interface MainVerse {
  book: string;
  chapter: number;
  verses: string;
  text: string;
}

export function AddSermon() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Database data
  const [topics, setTopics] = useState<Topic[]>([]);
  const [seriesList, setSeriesList] = useState<SermonSeries[]>([]);

  // Modal states
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [showNewSeriesModal, setShowNewSeriesModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newSeriesName, setNewSeriesName] = useState('');
  const [newSeriesDescription, setNewSeriesDescription] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [datePreached, setDatePreached] = useState('');
  const [pastorName, setPastorName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // Selection states
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedTestaments, setSelectedTestaments] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState('');
  
  const [keyTakeawaysInput, setKeyTakeawaysInput] = useState('');
  
  // Scripture references
  const [scriptureRefs, setScriptureRefs] = useState<ScriptureReference[]>([
    { book: '', chapter: 0, verses: '' }
  ]);
  
  // Main verses
  const [mainVerses, setMainVerses] = useState<MainVerse[]>([
    { book: '', chapter: 0, verses: '', text: '' }
  ]);

  // Fetch topics and series on mount
  useEffect(() => {
    fetchTopics();
    fetchSeries();
  }, []);

  const fetchTopics = async () => {
    const { data } = await supabase.from('topics').select('*').order('name');
    if (data) setTopics(data);
  };

  const fetchSeries = async () => {
    const { data } = await supabase.from('sermon_series').select('*').order('name');
    if (data) setSeriesList(data);
  };

  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) return;
    try {
      const { data, error } = await supabase
        .from('topics')
        .insert([{ name: newTopicName.trim() }])
        .select()
        .single();
      
      if (error) {
        alert('Error creating topic: ' + error.message);
        console.error('Error creating topic:', error);
        return;
      }
      
      if (data) {
        setTopics([...topics, data]);
        setSelectedTopics([...selectedTopics, data.id]);
        setNewTopicName('');
        setShowNewTopicModal(false);
      }
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleCreateSeries = async () => {
    if (!newSeriesName.trim()) return;
    try {
      const { data, error } = await supabase
        .from('sermon_series')
        .insert([{ name: newSeriesName.trim(), description: newSeriesDescription.trim() || null }])
        .select()
        .single();
      
      if (error) {
        alert('Error creating series: ' + error.message);
        console.error('Error creating series:', error);
        return;
      }
      
      if (data) {
        setSeriesList([...seriesList, data]);
        setSelectedSeriesId(data.id);
        setNewSeriesName('');
        setNewSeriesDescription('');
        setShowNewSeriesModal(false);
      }
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const toggleBook = (book: string) => {
    setSelectedBooks(prev => 
      prev.includes(book) ? prev.filter(b => b !== book) : [...prev, book]
    );
  };

  const toggleTestament = (testament: string) => {
    setSelectedTestaments(prev =>
      prev.includes(testament) ? prev.filter(t => t !== testament) : [...prev, testament]
    );
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId) ? prev.filter(t => t !== topicId) : [...prev, topicId]
    );
  };

  const addScriptureRef = () => {
    setScriptureRefs([...scriptureRefs, { book: '', chapter: 0, verses: '' }]);
  };

  const removeScriptureRef = (index: number) => {
    setScriptureRefs(scriptureRefs.filter((_, i) => i !== index));
  };

  const updateScriptureRef = (index: number, field: keyof ScriptureReference, value: string | number) => {
    const updated = [...scriptureRefs];
    updated[index] = { ...updated[index], [field]: value };
    setScriptureRefs(updated);
  };

  const addMainVerse = () => {
    setMainVerses([...mainVerses, { book: '', chapter: 0, verses: '', text: '' }]);
  };

  const removeMainVerse = (index: number) => {
    setMainVerses(mainVerses.filter((_, i) => i !== index));
  };

  const updateMainVerse = (index: number, field: keyof MainVerse, value: string | number) => {
    const updated = [...mainVerses];
    updated[index] = { ...updated[index], [field]: value };
    setMainVerses(updated);
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const keyTopics = selectedTopics.map(id => topics.find(t => t.id === id)?.name || '').filter(Boolean);
      const keyTakeaways = keyTakeawaysInput.split('\n').map(t => t.trim()).filter(Boolean);
      const selectedSeries = seriesList.find(s => s.id === selectedSeriesId);
      
      const validScriptureRefs = scriptureRefs.filter(ref => ref.book && ref.chapter && ref.verses);
      const validMainVerses = mainVerses.filter(v => v.book && v.chapter && v.verses);

      await sermonService.addSermon({
        title,
        datePreached,
        pastorName,
        scriptureReferences: validScriptureRefs,
        videoUrl: getYouTubeEmbedUrl(videoUrl),
        summary,
        keyTopics,
        mainVerses: validMainVerses,
        keyTakeaways,
        thumbnailUrl: thumbnailUrl || undefined,
        seriesId: selectedSeriesId || undefined,
        seriesName: selectedSeries?.name || undefined,
        viewCount: 0,
        duration: duration || undefined,
        status: 'published'
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add sermon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Add New Sermon
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
              Sermon added successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sermon Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    placeholder="e.g., Finding Peace in the Storm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Preached *</label>
                  <input
                    type="date"
                    value={datePreached}
                    onChange={(e) => setDatePreached(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pastor/Speaker *</label>
                  <input
                    type="text"
                    value={pastorName}
                    onChange={(e) => setPastorName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    placeholder="e.g., Pastor David Thompson"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    placeholder="e.g., 42:15"
                  />
                </div>
              </div>
            </section>

            {/* Sermon Series Section */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Sermon Series</h2>
                <button
                  type="button"
                  onClick={() => setShowNewSeriesModal(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  + Create New Series
                </button>
              </div>
              <select
                value={selectedSeriesId}
                onChange={(e) => setSelectedSeriesId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Select a sermon series (optional)</option>
                {seriesList.map(series => (
                  <option key={series.id} value={series.id}>{series.name}</option>
                ))}
              </select>
            </section>

            {/* Testament Selection */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Testament</h2>
              <div className="flex flex-wrap gap-3">
                {['Old Testament', 'New Testament'].map(testament => (
                  <button
                    key={testament}
                    type="button"
                    onClick={() => toggleTestament(testament)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedTestaments.includes(testament)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {testament}
                  </button>
                ))}
              </div>
            </section>

            {/* Bible Books Selection */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Bible Books (Multi-select)</h2>
              
              {selectedTestaments.includes('Old Testament') && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Old Testament</h3>
                  <div className="flex flex-wrap gap-2">
                    {OLD_TESTAMENT_BOOKS.map(book => (
                      <button
                        key={book}
                        type="button"
                        onClick={() => toggleBook(book)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedBooks.includes(book)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {book}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedTestaments.includes('New Testament') && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">New Testament</h3>
                  <div className="flex flex-wrap gap-2">
                    {NEW_TESTAMENT_BOOKS.map(book => (
                      <button
                        key={book}
                        type="button"
                        onClick={() => toggleBook(book)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedBooks.includes(book)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {book}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedTestaments.length === 0 && (
                <p className="text-gray-500 text-sm">Select a testament above to see available books</p>
              )}
            </section>

            {/* Topics Selection */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Topics (Multi-select)</h2>
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  + Create New Topic
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedTopics.includes(topic.id)
                        ? 'bg-secondary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {topic.name}
                  </button>
                ))}
                {topics.length === 0 && (
                  <p className="text-gray-500 text-sm">No topics yet. Create one to get started!</p>
                )}
              </div>
            </section>

            {/* Media Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Media</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {videoUrl && (
                    <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <iframe src={getYouTubeEmbedUrl(videoUrl)} className="w-full h-full" allowFullScreen />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </section>

            {/* Scripture References Section */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Scripture References</h2>
                <button type="button" onClick={addScriptureRef} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  + Add Reference
                </button>
              </div>
              <div className="space-y-4">
                {scriptureRefs.map((ref, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <select
                      value={ref.book}
                      onChange={(e) => updateScriptureRef(index, 'book', e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500"
                    >
                      <option value="">Select Book</option>
                      <optgroup label="Old Testament">
                        {OLD_TESTAMENT_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}
                      </optgroup>
                      <optgroup label="New Testament">
                        {NEW_TESTAMENT_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}
                      </optgroup>
                    </select>
                    <input
                      type="number"
                      value={ref.chapter || ''}
                      onChange={(e) => updateScriptureRef(index, 'chapter', parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 rounded-lg border border-gray-200"
                      placeholder="Ch."
                    />
                    <input
                      type="text"
                      value={ref.verses}
                      onChange={(e) => updateScriptureRef(index, 'verses', e.target.value)}
                      className="w-28 px-3 py-2 rounded-lg border border-gray-200"
                      placeholder="Verses"
                    />
                    {scriptureRefs.length > 1 && (
                      <button type="button" onClick={() => removeScriptureRef(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Content Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Content</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary *</label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                    placeholder="A brief summary of the sermon..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Takeaways (one per line)</label>
                  <textarea
                    value={keyTakeawaysInput}
                    onChange={(e) => setKeyTakeawaysInput(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
                    placeholder="Enter each takeaway on a new line..."
                  />
                </div>
              </div>
            </section>

            {/* Main Verses Section */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Main Verses (with text)</h2>
                <button type="button" onClick={addMainVerse} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  + Add Verse
                </button>
              </div>
              <div className="space-y-6">
                {mainVerses.map((verse, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex gap-4 items-start">
                      <select
                        value={verse.book}
                        onChange={(e) => updateMainVerse(index, 'book', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                      >
                        <option value="">Select Book</option>
                        <optgroup label="Old Testament">
                          {OLD_TESTAMENT_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}
                        </optgroup>
                        <optgroup label="New Testament">
                          {NEW_TESTAMENT_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}
                        </optgroup>
                      </select>
                      <input
                        type="number"
                        value={verse.chapter || ''}
                        onChange={(e) => updateMainVerse(index, 'chapter', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 rounded-lg border border-gray-200"
                        placeholder="Ch."
                      />
                      <input
                        type="text"
                        value={verse.verses}
                        onChange={(e) => updateMainVerse(index, 'verses', e.target.value)}
                        className="w-28 px-3 py-2 rounded-lg border border-gray-200"
                        placeholder="Verses"
                      />
                      {mainVerses.length > 1 && (
                        <button type="button" onClick={() => removeMainVerse(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <textarea
                      value={verse.text}
                      onChange={(e) => updateMainVerse(index, 'text', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 resize-none"
                      rows={2}
                      placeholder="Verse text..."
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 focus:ring-4 focus:ring-primary-500/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Adding Sermon...' : 'Add Sermon'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Topic</h3>
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 mb-4"
              placeholder="Topic name (e.g., Faith, Hope, Prayer)"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowNewTopicModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTopic}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Series Modal */}
      {showNewSeriesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Sermon Series</h3>
            <input
              type="text"
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 mb-4"
              placeholder="Series name"
            />
            <textarea
              value={newSeriesDescription}
              onChange={(e) => setNewSeriesDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 mb-4 resize-none"
              rows={3}
              placeholder="Description (optional)"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowNewSeriesModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSeries}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
