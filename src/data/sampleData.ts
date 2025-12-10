import type { Sermon, Topic, SermonSeries } from '../types';

// Sample sermon data
export const sermons: Sermon[] = [
  {
    id: '1',
    title: 'Finding Peace in the Storm',
    datePreached: '2024-12-08',
    pastorName: 'Pastor David Thompson',
    scriptureReferences: [
      { book: 'Matthew', chapter: 8, verses: '23-27' },
      { book: 'Psalm', chapter: 46, verses: '1-3' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'In this powerful message, Pastor David explores how we can find genuine peace even when life\'s storms threaten to overwhelm us. Drawing from the account of Jesus calming the storm, we discover that peace is not the absence of trouble, but the presence of Christ in our circumstances.',
    keyTopics: ['Peace', 'Faith', 'Trusting God'],
    mainVerses: [
      { book: 'Matthew', chapter: 8, verses: '26', text: 'He replied, "You of little faith, why are you so afraid?" Then he got up and rebuked the winds and the waves, and it was completely calm.' }
    ],
    keyTakeaways: [
      'Jesus is present with us in every storm',
      'Fear often reveals where our faith needs to grow',
      'His peace surpasses our understanding',
      'We can rest because He never sleeps'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    seriesId: '1',
    seriesName: 'Anchored: Finding Stability in Uncertain Times',
    viewCount: 342,
    duration: '42:15',
    status: 'published'
  },
  {
    id: '2',
    title: 'The Power of Forgiveness',
    datePreached: '2024-12-01',
    pastorName: 'Pastor Sarah Mitchell',
    scriptureReferences: [
      { book: 'Colossians', chapter: 3, verses: '12-14' },
      { book: 'Matthew', chapter: 18, verses: '21-22' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'Pastor Sarah delivers a transformative message about the healing power of forgiveness. Learn how releasing bitterness and embracing grace can set you free and restore your relationships with others and with God.',
    keyTopics: ['Forgiveness', 'Healing', 'Relationships'],
    mainVerses: [
      { book: 'Colossians', chapter: 3, verses: '13', text: 'Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.' }
    ],
    keyTakeaways: [
      'Forgiveness is a choice, not a feeling',
      'Unforgiveness hurts us more than the offender',
      'God\'s grace empowers us to extend grace',
      'Healing begins when we let go'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
    viewCount: 289,
    duration: '38:42',
    status: 'published'
  },
  {
    id: '3',
    title: 'Walking in Your Calling',
    datePreached: '2024-11-24',
    pastorName: 'Pastor David Thompson',
    scriptureReferences: [
      { book: 'Ephesians', chapter: 2, verses: '10' },
      { book: 'Jeremiah', chapter: 29, verses: '11' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'What is God\'s purpose for your life? In this inspiring message, discover how God has uniquely designed you for a specific purpose. Pastor David shares practical steps to identify and walk confidently in your divine calling.',
    keyTopics: ['Purpose', 'Calling', 'Identity'],
    mainVerses: [
      { book: 'Ephesians', chapter: 2, verses: '10', text: 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.' }
    ],
    keyTakeaways: [
      'You are created with intentional purpose',
      'Your unique gifts reveal your calling',
      'Obedience opens doors to destiny',
      'God equips those He calls'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    seriesId: '2',
    seriesName: 'Purpose Driven',
    viewCount: 456,
    duration: '44:18',
    status: 'published'
  },
  {
    id: '4',
    title: 'Overcoming Anxiety with Faith',
    datePreached: '2024-11-17',
    pastorName: 'Pastor Sarah Mitchell',
    scriptureReferences: [
      { book: 'Philippians', chapter: 4, verses: '6-7' },
      { book: '1 Peter', chapter: 5, verses: '7' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'Anxiety affects millions, but God offers us a different way. Pastor Sarah shares biblical truths and practical strategies for exchanging our worries for His peace. Learn how to cast your cares on the One who cares for you.',
    keyTopics: ['Anxiety', 'Faith', 'Mental Health', 'Peace'],
    mainVerses: [
      { book: 'Philippians', chapter: 4, verses: '6-7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' }
    ],
    keyTakeaways: [
      'Anxiety is common but not our destiny',
      'Prayer is the antidote to worry',
      'Gratitude shifts our perspective',
      'God\'s peace guards our hearts'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop',
    viewCount: 521,
    duration: '41:30',
    status: 'published'
  },
  {
    id: '5',
    title: 'Building Strong Families',
    datePreached: '2024-11-10',
    pastorName: 'Pastor David Thompson',
    scriptureReferences: [
      { book: 'Deuteronomy', chapter: 6, verses: '4-9' },
      { book: 'Proverbs', chapter: 22, verses: '6' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'The family is God\'s foundational institution. In this message, Pastor David shares timeless biblical principles for building a home that honors God and nurtures each family member to become all God designed them to be.',
    keyTopics: ['Family', 'Parenting', 'Marriage', 'Relationships'],
    mainVerses: [
      { book: 'Deuteronomy', chapter: 6, verses: '6-7', text: 'These commandments that I give you today are to be on your hearts. Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up.' }
    ],
    keyTakeaways: [
      'Faith is caught more than taught',
      'Intentional time together builds bonds',
      'Communication is the lifeblood of family',
      'Grace must be the atmosphere at home'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
    seriesId: '3',
    seriesName: 'Home Foundations',
    viewCount: 398,
    duration: '39:45',
    status: 'published'
  },
  {
    id: '6',
    title: 'The Joy of Generosity',
    datePreached: '2024-11-03',
    pastorName: 'Pastor Sarah Mitchell',
    scriptureReferences: [
      { book: '2 Corinthians', chapter: 9, verses: '6-8' },
      { book: 'Acts', chapter: 20, verses: '35' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'God designed us to be conduits of blessing, not reservoirs. Discover the supernatural joy that comes from living with open hands and a generous heart. Pastor Sarah unpacks the biblical principles of sowing and reaping.',
    keyTopics: ['Generosity', 'Stewardship', 'Joy', 'Giving'],
    mainVerses: [
      { book: '2 Corinthians', chapter: 9, verses: '7', text: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.' }
    ],
    keyTakeaways: [
      'Generosity reflects God\'s character',
      'We reap what we sow',
      'Giving breaks the power of greed',
      'Cheerful giving brings supernatural joy'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop',
    viewCount: 267,
    duration: '37:20',
    status: 'published'
  },
  {
    id: '7',
    title: 'Living with Eternal Perspective',
    datePreached: '2024-10-27',
    pastorName: 'Pastor David Thompson',
    scriptureReferences: [
      { book: 'Colossians', chapter: 3, verses: '1-4' },
      { book: '2 Corinthians', chapter: 4, verses: '16-18' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'When we focus on the eternal, the temporary troubles of today take on new meaning. Pastor David challenges us to lift our eyes above our circumstances and live with heaven\'s values guiding our daily decisions.',
    keyTopics: ['Eternity', 'Perspective', 'Hope', 'Faith'],
    mainVerses: [
      { book: '2 Corinthians', chapter: 4, verses: '18', text: 'So we fix our eyes not on what is seen, but on what is unseen, since what is seen is temporary, but what is unseen is eternal.' }
    ],
    keyTakeaways: [
      'Our struggles are temporary; God\'s promises are eternal',
      'Heaven\'s perspective transforms our priorities',
      'Living for eternity brings daily peace',
      'What we do for Christ echoes forever'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
    seriesId: '1',
    seriesName: 'Anchored: Finding Stability in Uncertain Times',
    viewCount: 312,
    duration: '43:50',
    status: 'published'
  },
  {
    id: '8',
    title: 'The Heart of Worship',
    datePreached: '2024-10-20',
    pastorName: 'Pastor Sarah Mitchell',
    scriptureReferences: [
      { book: 'John', chapter: 4, verses: '23-24' },
      { book: 'Psalm', chapter: 100, verses: '1-5' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'Worship is more than singing—it\'s a lifestyle of surrender and adoration. Pastor Sarah explores what it means to worship in spirit and truth, and how genuine worship transforms us from the inside out.',
    keyTopics: ['Worship', 'Prayer', 'Spiritual Growth'],
    mainVerses: [
      { book: 'John', chapter: 4, verses: '24', text: 'God is spirit, and his worshipers must worship in the Spirit and in truth.' }
    ],
    keyTakeaways: [
      'True worship flows from a surrendered heart',
      'Worship is a lifestyle, not just a song',
      'Spirit and truth work together in worship',
      'Worship transforms the worshiper'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
    viewCount: 445,
    duration: '40:15',
    status: 'published'
  },
  {
    id: '9',
    title: 'Trusting God in Uncertainty',
    datePreached: '2024-10-13',
    pastorName: 'Pastor David Thompson',
    scriptureReferences: [
      { book: 'Proverbs', chapter: 3, verses: '5-6' },
      { book: 'Isaiah', chapter: 41, verses: '10' }
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'When the path ahead is unclear, we can still walk confidently. Pastor David shares how to trust God when you can\'t trace His hand, finding security not in knowing the future but in knowing the One who holds it.',
    keyTopics: ['Trust', 'Faith', 'Uncertainty', 'God\'s Guidance'],
    mainVerses: [
      { book: 'Proverbs', chapter: 3, verses: '5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' }
    ],
    keyTakeaways: [
      'Trust is a decision, not just a feeling',
      'God\'s understanding exceeds our own',
      'Submission precedes direction',
      'He makes crooked paths straight'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
    seriesId: '1',
    seriesName: 'Anchored: Finding Stability in Uncertain Times',
    viewCount: 378,
    duration: '42:00',
    status: 'published'
  }
];

// Sample topics
export const topics: Topic[] = [
  {
    id: '1',
    name: 'Faith & Trust',
    description: 'Messages about believing God and trusting His plan even when we can\'t see the way forward.',
    iconName: 'heart',
    colorTheme: 'faith',
    sermonCount: 12
  },
  {
    id: '2',
    name: 'Relationships & Family',
    description: 'Biblical wisdom for marriage, parenting, friendships, and all our important relationships.',
    iconName: 'users',
    colorTheme: 'relationships',
    sermonCount: 8
  },
  {
    id: '3',
    name: 'Purpose & Calling',
    description: 'Discovering God\'s unique design for your life and walking in your divine destiny.',
    iconName: 'compass',
    colorTheme: 'purpose',
    sermonCount: 6
  },
  {
    id: '4',
    name: 'Forgiveness & Healing',
    description: 'Finding freedom through forgiveness and experiencing God\'s restorative power.',
    iconName: 'refresh',
    colorTheme: 'healing',
    sermonCount: 7
  },
  {
    id: '5',
    name: 'Prayer & Worship',
    description: 'Deepening your communion with God through prayer, worship, and spiritual disciplines.',
    iconName: 'hands',
    colorTheme: 'prayer',
    sermonCount: 9
  },
  {
    id: '6',
    name: 'Spiritual Growth',
    description: 'Growing in maturity and becoming more like Christ in character and conduct.',
    iconName: 'trending-up',
    colorTheme: 'growth',
    sermonCount: 11
  },
  {
    id: '7',
    name: 'Hope & Encouragement',
    description: 'Messages of hope for difficult seasons and encouragement for the journey ahead.',
    iconName: 'sun',
    colorTheme: 'hope',
    sermonCount: 10
  },
  {
    id: '8',
    name: 'Wisdom & Guidance',
    description: 'Practical biblical wisdom for everyday decisions and life\'s important choices.',
    iconName: 'lightbulb',
    colorTheme: 'wisdom',
    sermonCount: 5
  },
  {
    id: '9',
    name: 'Anxiety & Mental Health',
    description: 'Finding peace and hope in Christ while navigating mental health challenges.',
    iconName: 'brain',
    colorTheme: 'healing',
    sermonCount: 4
  },
  {
    id: '10',
    name: 'Generosity & Stewardship',
    description: 'Managing God\'s resources wisely and living with open-handed generosity.',
    iconName: 'gift',
    colorTheme: 'purpose',
    sermonCount: 3
  }
];

// Sample sermon series
export const sermonSeries: SermonSeries[] = [
  {
    id: '1',
    title: 'Anchored',
    subtitle: 'Finding Stability in Uncertain Times',
    description: 'In a world that feels increasingly unstable, discover how to anchor your soul in the unchanging truths of God\'s Word. This 8-week series explores practical ways to find peace, hope, and unshakeable faith.',
    startDate: '2024-10-01',
    endDate: '2024-12-15',
    artworkUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    sermonCount: 4,
    isOngoing: true
  },
  {
    id: '2',
    title: 'Purpose Driven',
    subtitle: 'Discovering Your God-Given Design',
    description: 'You were created on purpose, for a purpose. Join us for this transformative series as we explore how to discover, develop, and deploy your unique gifts and calling.',
    startDate: '2024-09-01',
    endDate: '2024-09-29',
    artworkUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
    sermonCount: 4,
    isOngoing: false
  },
  {
    id: '3',
    title: 'Home Foundations',
    subtitle: 'Building Families That Last',
    description: 'Strong families don\'t happen by accident. This series provides biblical blueprints for building a home filled with love, faith, and lasting legacy.',
    startDate: '2024-11-01',
    endDate: '2024-11-24',
    artworkUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=400&fit=crop',
    sermonCount: 3,
    isOngoing: false
  }
];

// Bible books for filtering
export const bibleBooks = {
  oldTestament: [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
  ],
  newTestament: [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ]
};
