import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from './Header';
import { sermonService } from '../services/sermonService';
import type { Sermon } from '../types';

export function SermonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'notes'>('summary');

  useEffect(() => {
    async function fetchSermon() {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        const dbSermon = await sermonService.getSermonById(id);
        if (dbSermon) {
          setSermon(dbSermon);
          // Increment view count in background
          sermonService.incrementViewCount(id).catch(() => {});
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching sermon:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    }
    fetchSermon();
  }, [id, navigate]);

  if (isLoading || !sermon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatScripture = (references: Sermon['scriptureReferences']) => {
    return references.map(ref => `${ref.book} ${ref.chapter}:${ref.verses}`).join(', ');
  };

  const getTopicStyle = (topic: string): string => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('faith') || topicLower.includes('trust')) return 'tag-faith';
    if (topicLower.includes('family') || topicLower.includes('relationship') || topicLower.includes('marriage')) return 'tag-relationships';
    if (topicLower.includes('purpose') || topicLower.includes('calling') || topicLower.includes('identity')) return 'tag-purpose';
    if (topicLower.includes('healing') || topicLower.includes('forgiveness')) return 'tag-healing';
    if (topicLower.includes('prayer') || topicLower.includes('worship')) return 'tag-prayer';
    if (topicLower.includes('growth') || topicLower.includes('spiritual')) return 'tag-growth';
    if (topicLower.includes('hope') || topicLower.includes('joy') || topicLower.includes('peace')) return 'tag-hope';
    if (topicLower.includes('wisdom') || topicLower.includes('guidance')) return 'tag-wisdom';
    return 'bg-gray-100 text-gray-700';
  };

  const getEmbedUrl = (url: string): string => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sermons
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Video Player */}
          {sermon.videoUrl && (
            <div className="relative aspect-video bg-black">
              <iframe
                src={getEmbedUrl(sermon.videoUrl)}
                title={sermon.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
              <div className="flex-1">
                {/* Series badge */}
                {sermon.seriesName && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {sermon.seriesName}
                  </div>
                )}

                <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {sermon.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{formatDate(sermon.datePreached)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {sermon.pastorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-sm">{sermon.pastorName}</span>
                  </div>
                  {sermon.duration && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{sermon.duration}</span>
                    </div>
                  )}
                </div>

                {/* Scripture reference */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-800 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="font-semibold">{formatScripture(sermon.scriptureReferences)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Topic tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {sermon.keyTopics.map((topic, idx) => (
                <span 
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:shadow-md transition-shadow ${getTopicStyle(topic)}`}
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex gap-8">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'summary'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Summary & Notes
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'notes'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Personal Notes
                  {notes && (
                    <span className="w-2 h-2 rounded-full bg-primary-600" />
                  )}
                </button>
              </nav>
            </div>

            {activeTab === 'summary' ? (
              <div className="space-y-8">
                {/* Summary */}
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Sermon Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {sermon.summary}
                  </p>
                </section>

                {/* Key Topics */}
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Key Topics Discussed
                  </h2>
                  <ul className="space-y-2">
                    {sermon.keyTopics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Main Verses */}
                {sermon.mainVerses && sermon.mainVerses.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                      Main Verses & References
                    </h2>
                    <div className="space-y-3">
                      {sermon.mainVerses.map((verse, idx) => (
                        <div key={idx} className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
                          <p className="font-semibold text-primary-800 mb-2">{verse.book} {verse.chapter}:{verse.verses}</p>
                          {verse.text && (
                            <p className="text-gray-700 italic">"{verse.text}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Key Takeaways */}
                <section>
                  <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                    Key Takeaways
                  </h2>
                  <div className="grid gap-3">
                    {sermon.keyTakeaways.map((takeaway, idx) => (
                      <div 
                        key={idx}
                        className="flex items-start gap-4 p-4 bg-secondary-50 rounded-xl border border-secondary-200"
                      >
                        <div className="w-8 h-8 rounded-full bg-secondary-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-gray-800 font-medium">{takeaway}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
                    My Personal Notes
                  </h2>
                  <span className="text-sm text-gray-500">Auto-saved</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write your reflections, questions, or action items from this sermon..."
                  className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none transition-all"
                />
                <p className="text-sm text-gray-500">
                  Your notes are private and will be saved to your account.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
