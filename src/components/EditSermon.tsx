import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sermonService } from '../services/sermonService';
import { supabase } from '../lib/supabase';
import { AdminLayout } from './AdminLayout';

const OLD_TESTAMENT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', 
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
];

const NEW_TESTAMENT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', 
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', 
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

interface Topic { id: string; name: string; }
interface SermonSeries { id: string; name: string; description?: string; }
interface ScriptureReference { book: string; chapter: number; verses: string; }
interface MainVerse { book: string; chapter: number; verses: string; text: string; }

export function EditSermon() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [seriesList, setSeriesList] = useState<SermonSeries[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [datePreached, setDatePreached] = useState('');
  const [pastorName, setPastorName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState('');
  const [keyTakeawaysInput, setKeyTakeawaysInput] = useState('');
  const [scriptureRefs, setScriptureRefs] = useState<ScriptureReference[]>([{ book: '', chapter: 0, verses: '' }]);
  const [mainVerses, setMainVerses] = useState<MainVerse[]>([{ book: '', chapter: 0, verses: '', text: '' }]);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    try {
      const [sermon, topicsData, seriesData] = await Promise.all([
        sermonService.getSermonById(id),
        supabase.from('topics').select('*').order('name'),
        supabase.from('sermon_series').select('*').order('name')
      ]);

      if (!sermon) {
        navigate('/admin');
        return;
      }

      if (topicsData.data) setTopics(topicsData.data);
      if (seriesData.data) setSeriesList(seriesData.data);

      // Populate form
      setTitle(sermon.title);
      setDatePreached(sermon.datePreached);
      setPastorName(sermon.pastorName);
      setVideoUrl(sermon.videoUrl || '');
      setSummary(sermon.summary);
      setDuration(sermon.duration || '');
      setThumbnailUrl(sermon.thumbnailUrl || '');
      setKeyTakeawaysInput(sermon.keyTakeaways?.join('\n') || '');
      
      if (sermon.scriptureReferences?.length > 0) {
        setScriptureRefs(sermon.scriptureReferences);
      }
      if (sermon.mainVerses?.length > 0) {
        setMainVerses(sermon.mainVerses.map(v => ({ ...v, text: v.text || '' })));
      }

      // Match topics by name
      const topicIds = topicsData.data?.filter(t => sermon.keyTopics.includes(t.name)).map(t => t.id) || [];
      setSelectedTopics(topicIds);

      // Match series by name
      const series = seriesData.data?.find(s => s.name === sermon.seriesName);
      if (series) setSelectedSeriesId(series.id);

    } catch (err) {
      console.error('Error loading sermon:', err);
      setError('Failed to load sermon');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => prev.includes(topicId) ? prev.filter(t => t !== topicId) : [...prev, topicId]);
  };

  const addScriptureRef = () => setScriptureRefs([...scriptureRefs, { book: '', chapter: 0, verses: '' }]);
  const removeScriptureRef = (index: number) => setScriptureRefs(scriptureRefs.filter((_, i) => i !== index));
  const updateScriptureRef = (index: number, field: keyof ScriptureReference, value: string | number) => {
    const updated = [...scriptureRefs];
    updated[index] = { ...updated[index], [field]: value };
    setScriptureRefs(updated);
  };

  const addMainVerse = () => setMainVerses([...mainVerses, { book: '', chapter: 0, verses: '', text: '' }]);
  const removeMainVerse = (index: number) => setMainVerses(mainVerses.filter((_, i) => i !== index));
  const updateMainVerse = (index: number, field: keyof MainVerse, value: string | number) => {
    const updated = [...mainVerses];
    updated[index] = { ...updated[index], [field]: value };
    setMainVerses(updated);
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return '';
    if (url.includes('youtube.com/watch')) return `https://www.youtube.com/embed/${url.split('v=')[1]?.split('&')[0]}`;
    if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`;
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setIsSubmitting(true);

    try {
      const keyTopics = selectedTopics.map(tid => topics.find(t => t.id === tid)?.name || '').filter(Boolean);
      const keyTakeaways = keyTakeawaysInput.split('\n').map(t => t.trim()).filter(Boolean);
      const selectedSeries = seriesList.find(s => s.id === selectedSeriesId);
      const validScriptureRefs = scriptureRefs.filter(ref => ref.book && ref.chapter && ref.verses);
      const validMainVerses = mainVerses.filter(v => v.book && v.chapter && v.verses);

      await sermonService.updateSermon(id, {
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
        seriesName: selectedSeries?.name || undefined,
        duration: duration || undefined
      });

      setSuccess(true);
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update sermon');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Edit Sermon
          </h1>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}
          {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">Sermon updated! Redirecting...</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sermon Title *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Preached *</label>
                  <input type="date" value={datePreached} onChange={(e) => setDatePreached(e.target.value)} required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pastor/Speaker *</label>
                  <input type="text" value={pastorName} onChange={(e) => setPastorName(e.target.value)} required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 42:15"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500" />
                </div>
              </div>
            </section>

            {/* Series */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Sermon Series</h2>
              <select value={selectedSeriesId} onChange={(e) => setSelectedSeriesId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500">
                <option value="">Select a sermon series (optional)</option>
                {seriesList.map(series => <option key={series.id} value={series.id}>{series.name}</option>)}
              </select>
            </section>

            {/* Topics */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {topics.map(topic => (
                  <button key={topic.id} type="button" onClick={() => toggleTopic(topic.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedTopics.includes(topic.id) ? 'bg-secondary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    {topic.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Media */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Media</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL</label>
                  <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                  <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500" />
                </div>
              </div>
            </section>

            {/* Scripture References */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Scripture References</h2>
                <button type="button" onClick={addScriptureRef} className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add</button>
              </div>
              <div className="space-y-4">
                {scriptureRefs.map((ref, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <select value={ref.book} onChange={(e) => updateScriptureRef(index, 'book', e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200">
                      <option value="">Select Book</option>
                      <optgroup label="Old Testament">{OLD_TESTAMENT_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}</optgroup>
                      <optgroup label="New Testament">{NEW_TESTAMENT_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}</optgroup>
                    </select>
                    <input type="number" value={ref.chapter || ''} onChange={(e) => updateScriptureRef(index, 'chapter', parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 rounded-lg border border-gray-200" placeholder="Ch." />
                    <input type="text" value={ref.verses} onChange={(e) => updateScriptureRef(index, 'verses', e.target.value)}
                      className="w-28 px-3 py-2 rounded-lg border border-gray-200" placeholder="Verses" />
                    {scriptureRefs.length > 1 && (
                      <button type="button" onClick={() => removeScriptureRef(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Content */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Content</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Summary *</label>
                  <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Takeaways (one per line)</label>
                  <textarea value={keyTakeawaysInput} onChange={(e) => setKeyTakeawaysInput(e.target.value)} rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 resize-none" />
                </div>
              </div>
            </section>

            {/* Main Verses */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Main Verses</h2>
                <button type="button" onClick={addMainVerse} className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add</button>
              </div>
              <div className="space-y-6">
                {mainVerses.map((verse, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="flex gap-4 items-start">
                      <select value={verse.book} onChange={(e) => updateMainVerse(index, 'book', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200">
                        <option value="">Select Book</option>
                        <optgroup label="Old Testament">{OLD_TESTAMENT_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}</optgroup>
                        <optgroup label="New Testament">{NEW_TESTAMENT_BOOKS.map(book => <option key={book} value={book}>{book}</option>)}</optgroup>
                      </select>
                      <input type="number" value={verse.chapter || ''} onChange={(e) => updateMainVerse(index, 'chapter', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 rounded-lg border border-gray-200" placeholder="Ch." />
                      <input type="text" value={verse.verses} onChange={(e) => updateMainVerse(index, 'verses', e.target.value)}
                        className="w-28 px-3 py-2 rounded-lg border border-gray-200" placeholder="Verses" />
                      {mainVerses.length > 1 && (
                        <button type="button" onClick={() => removeMainVerse(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                      )}
                    </div>
                    <textarea value={verse.text} onChange={(e) => updateMainVerse(index, 'text', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 resize-none" rows={2} placeholder="Verse text..." />
                  </div>
                ))}
              </div>
            </section>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t">
              <button type="button" onClick={() => navigate('/admin')}
                className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
