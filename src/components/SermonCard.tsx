import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Sermon } from '../types';

interface SermonCardProps {
  sermon: Sermon;
}

export function SermonCard({ sermon }: SermonCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatScripture = (references: Sermon['scriptureReferences']) => {
    if (!references || references.length === 0) return '';
    const ref = references[0];
    return `${ref.book} ${ref.chapter}:${ref.verses}`;
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

  return (
    <Link to={`/sermon/${sermon.id}`}>
      <article 
        className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer card-shine"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={sermon.thumbnailUrl || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=300&fit=crop'} 
          alt={sermon.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Duration badge */}
        {sermon.duration && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded-md text-white text-xs font-medium backdrop-blur-sm">
            {sermon.duration}
          </div>
        )}

        {/* Series badge */}
        {sermon.seriesName && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary-600/90 rounded-md text-white text-xs font-medium backdrop-blur-sm">
            {sermon.seriesName.split(':')[0]}
          </div>
        )}

        {/* Play overlay on hover */}
        <div className={`absolute inset-0 flex items-center justify-center bg-primary-900/30 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
            <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Date and Scripture */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{formatDate(sermon.datePreached)}</span>
          <span className="font-medium text-primary-600">{formatScripture(sermon.scriptureReferences)}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
          {sermon.title}
        </h3>

        {/* Preview text on hover */}
        <p className={`text-sm text-gray-600 mb-3 transition-all duration-300 ${isHovered ? 'line-clamp-2 opacity-100' : 'line-clamp-1 opacity-70'}`}>
          {sermon.summary}
        </p>

        {/* Pastor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
            {sermon.pastorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <span className="text-sm text-gray-600">{sermon.pastorName}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sermon.keyTopics.slice(0, 3).map((topic, idx) => (
            <span 
              key={idx} 
              className={`px-2 py-1 rounded-full text-xs font-medium ${getTopicStyle(topic)}`}
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
              aria-label="Share sermon"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{sermon.viewCount}</span>
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
}

