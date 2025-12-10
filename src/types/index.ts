// Sermon related types
export interface Scripture {
  book: string;
  chapter: number;
  verses: string; // e.g., "16-21"
  text?: string;
}

export interface Sermon {
  id: string;
  title: string;
  datePreached: string;
  pastorName: string;
  pastorImage?: string;
  scriptureReferences: Scripture[];
  videoUrl?: string;
  summary: string;
  keyTopics: string[];
  mainVerses: Scripture[];
  keyTakeaways: string[];
  thumbnailUrl?: string;
  seriesId?: string;
  seriesName?: string;
  viewCount: number;
  duration?: string; // e.g., "45:32"
  status: 'draft' | 'published';
}

// Topic related types
export interface Topic {
  id: string;
  name: string;
  description: string;
  iconName: string;
  colorTheme: string;
  sermonCount: number;
}

// Series related types
export interface SermonSeries {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  artworkUrl?: string;
  sermonCount: number;
  isOngoing: boolean;
}

// Filter types
export interface FilterState {
  searchQuery: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  testament?: 'old' | 'new';
  scriptureBook?: string;
  topics: string[];
  seriesId?: string;
  sortBy: 'recent' | 'oldest' | 'views' | 'alphabetical';
}

// User related types (for future use)
export interface UserNote {
  id: string;
  sermonId: string;
  content: string;
  highlightedTakeaways: number[];
  createdAt: string;
  updatedAt: string;
}
