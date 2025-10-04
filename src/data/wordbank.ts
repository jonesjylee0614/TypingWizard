// 常用英文单词库
export const commonWords = {
  easy: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
  ],
  medium: [
    'man', 'world', 'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 'work',
    'week', 'case', 'point', 'government', 'company', 'number', 'group', 'problem', 'fact', 'home',
    'water', 'room', 'mother', 'area', 'money', 'story', 'business', 'night', 'study', 'book',
    'word', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend', 'father', 'power',
    'hour', 'game', 'line', 'end', 'member', 'law', 'car', 'city', 'name', 'team',
    'minute', 'idea', 'kid', 'body', 'information', 'back', 'parent', 'face', 'others', 'level',
    'office', 'door', 'health', 'person', 'art', 'war', 'history', 'party', 'result', 'change',
    'morning', 'reason', 'research', 'girl', 'guy', 'moment', 'air', 'teacher', 'force', 'education'
  ],
  hard: [
    'question', 'social', 'program', 'difference', 'attention', 'development', 'experience', 'family', 'president', 'community',
    'process', 'important', 'school', 'system', 'activity', 'company', 'example', 'country', 'control', 'interest',
    'action', 'position', 'relationship', 'environment', 'performance', 'opportunity', 'responsibility', 'technology', 'knowledge', 'communication',
    'understand', 'available', 'individual', 'although', 'situation', 'direction', 'statement', 'remember', 'possibility', 'everything',
    'consider', 'continue', 'necessary', 'especially', 'international', 'organization', 'beautiful', 'difficult', 'particular', 'management'
  ]
};

// 经典英文句子
export const classicSentences = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump!',
  'The five boxing wizards jump quickly.',
  'Sphinx of black quartz, judge my vow.',
  'Two driven jocks help fax my big quiz.',
  'Five quacking zephyrs jolt my wax bed.',
  'The jay, pig, fox, zebra and my wolves quack!',
  'All good things must come to an end.',
  'Practice makes perfect.',
  'Actions speak louder than words.',
  'Knowledge is power.',
  'Time is money.',
  'Where there is a will, there is a way.',
  'Better late than never.',
  'Every cloud has a silver lining.',
  'Rome was not built in a day.',
  'The early bird catches the worm.',
  'When in Rome, do as the Romans do.',
  'No pain, no gain.',
  'A journey of a thousand miles begins with a single step.',
  'You cannot judge a book by its cover.',
  'Two heads are better than one.',
  'The pen is mightier than the sword.',
  'Fortune favors the bold.',
  'Honesty is the best policy.',
  'A friend in need is a friend indeed.',
  'Beauty is in the eye of the beholder.',
  'Curiosity killed the cat.',
  'The grass is always greener on the other side.'
];

// 励志句子
export const motivationalSentences = [
  'Believe in yourself and you can achieve anything.',
  'Dream big and work hard to make it happen.',
  'Every expert was once a beginner.',
  'Success is a journey, not a destination.',
  'You are stronger than you think.',
  'Learning is the beginning of wealth.',
  'The future belongs to those who believe in the beauty of their dreams.',
  'You can do it if you try your best.',
  'Mistakes are proof that you are trying.',
  'Be brave and never give up.',
  'Your only limit is you.',
  'Great things take time.',
  'Stay positive and work hard.',
  'You are capable of amazing things.',
  'Keep going and never stop learning.'
];

// 简单短语（用于初级关卡）
export const simplePhrases = [
  'hello world',
  'good morning',
  'thank you',
  'see you soon',
  'have a nice day',
  'how are you',
  'I am fine',
  'lets go',
  'welcome home',
  'happy birthday',
  'good job',
  'well done',
  'keep going',
  'stay strong',
  'be happy',
  'love life',
  'dream big',
  'work hard',
  'never give up',
  'you can do it'
];

// 随机选择工具函数
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// 生成随机单词序列
export const generateWordSequence = (difficulty: 'easy' | 'medium' | 'hard', wordCount: number): string => {
  const words = commonWords[difficulty];
  const selected = getRandomItems(words, wordCount);
  return selected.join(' ');
};

// 生成混合难度的单词序列
export const generateMixedWordSequence = (wordCount: number): string => {
  const allWords = [...commonWords.easy, ...commonWords.medium, ...commonWords.hard];
  const selected = getRandomItems(allWords, wordCount);
  return selected.join(' ');
};

