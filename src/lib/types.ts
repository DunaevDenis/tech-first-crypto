// Content block types for structured content
export type ContentBlockType = 
  | 'heading' 
  | 'paragraph' 
  | 'callout' 
  | 'figure' 
  | 'list';

export interface HeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
}

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
  glossaryTermRefs?: string[];
}

export interface CalloutBlock {
  type: 'callout';
  calloutType: 'keyidea' | 'misconception' | 'threatmodel' | 'securitynote' | 'tryit';
  title: string;
  body: string;
}

export interface FigureBlock {
  type: 'figure';
  figureType: 'svg' | 'image' | 'interactive';
  refSlug?: string;
  src?: string;
  caption?: string;
}

export interface ListBlock {
  type: 'list';
  items: string[];
  ordered?: boolean;
}

export type ContentBlock = HeadingBlock | ParagraphBlock | CalloutBlock | FigureBlock | ListBlock;

// Database model types
export interface Chapter {
  id: string;
  title: string;
  slug: string;
  track: 'technology' | 'wallets' | 'exchanges';
  order_num: number;
  summary: string | null;
  reading_time: number;
  created_at: string;
}

export interface Section {
  id: string;
  chapter_id: string;
  title: string;
  slug: string;
  order_num: number;
  content_json: ContentBlock[];
  created_at: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  category: string;
  short_def: string;
  full_def: string | null;
  related_terms: string[];
  linked_sections: string[];
  created_at: string;
}

export interface Interactive {
  id: string;
  title: string;
  slug: string;
  description: string;
  embed_type: string;
  embed_url: string | null;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  linked_sections: string[];
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  section_id: string;
  last_position: number;
  completed: boolean;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  section_id: string;
  created_at: string;
}

export interface Highlight {
  id: string;
  user_id: string;
  section_id: string;
  quote: string;
  note: string | null;
  created_at: string;
}

// Track display info
export const TRACKS = {
  technology: {
    id: 'technology',
    name: 'Технология',
    description: 'Блокчейн, криптография, консенсус',
    icon: 'Cpu',
    color: 'track-technology'
  },
  wallets: {
    id: 'wallets',
    name: 'Кошельки',
    description: 'Управление ключами и безопасность',
    icon: 'Wallet',
    color: 'track-wallets'
  },
  exchanges: {
    id: 'exchanges',
    name: 'Биржи',
    description: 'Инфраструктура без трейдинга',
    icon: 'ArrowLeftRight',
    color: 'track-exchanges'
  }
} as const;

// Callout type display info
export const CALLOUT_TYPES = {
  keyidea: {
    title: 'Ключевая идея',
    icon: 'Lightbulb',
    className: 'callout-keyidea'
  },
  misconception: {
    title: 'Частое заблуждение',
    icon: 'AlertTriangle',
    className: 'callout-misconception'
  },
  threatmodel: {
    title: 'Модель угроз',
    icon: 'Shield',
    className: 'callout-threat'
  },
  securitynote: {
    title: 'Заметка по безопасности',
    icon: 'Lock',
    className: 'callout-security'
  },
  tryit: {
    title: 'Попробуй',
    icon: 'Play',
    className: 'callout-tryit'
  }
} as const;

export const DIFFICULTY_LABELS = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый'
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  cryptography: 'Криптография',
  consensus: 'Консенсус',
  wallets: 'Кошельки',
  l2: 'L2 и масштабирование',
  exchanges: 'Биржи',
  security: 'Безопасность',
  basics: 'Основы'
};
