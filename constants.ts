import { WordData, WordType } from './types';

export const COLORS = {
  BACKGROUND: '#000000',
  TEXT_MAIN: '#FFFFFF',
  ACCENT_GREEN: '#39FF14', // Neon Green
  ACCENT_PINK: '#FF00FF',  // Neon Pink
  ACCENT_CYAN: '#00FFFF',  // Neon Cyan
  ACCENT_RED: '#FF3333',
  ACCENT_YELLOW: '#FFD700', // Gold/Yellow for Enemies
  UI_BORDER: '#FFFFFF',
};

// Vocabulary mix: Middle School to High School 1st Year (CEFR A2/B1)
export const WORD_LIST: WordData[] = [
  // --- NOUNS (名詞) ---
  { text: "Solution", jp: "解決策", type: WordType.NOUN },
  { text: "Evidence", jp: "証拠", type: WordType.NOUN },
  { text: "Heritage", jp: "遺産", type: WordType.NOUN },
  { text: "Economy", jp: "経済", type: WordType.NOUN },
  { text: "Pollution", jp: "汚染", type: WordType.NOUN },
  { text: "Atmosphere", jp: "雰囲気/大気", type: WordType.NOUN },
  { text: "Audience", jp: "聴衆", type: WordType.NOUN },
  { text: "Purpose", jp: "目的", type: WordType.NOUN },
  { text: "Opinion", jp: "意見", type: WordType.NOUN },
  { text: "Advantage", jp: "利点", type: WordType.NOUN },
  { text: "Century", jp: "世紀", type: WordType.NOUN },
  { text: "Detail", jp: "詳細", type: WordType.NOUN },
  { text: "Flavor", jp: "風味", type: WordType.NOUN },
  { text: "Surface", jp: "表面", type: WordType.NOUN },
  { text: "Resource", jp: "資源", type: WordType.NOUN },
  { text: "Passenger", jp: "乗客", type: WordType.NOUN },
  { text: "Ability", jp: "能力", type: WordType.NOUN },
  { text: "Memory", jp: "記憶", type: WordType.NOUN },
  { text: "Quality", jp: "質", type: WordType.NOUN },
  { text: "Standard", jp: "基準", type: WordType.NOUN },
  { text: "Tradition", jp: "伝統", type: WordType.NOUN },
  { text: "Government", jp: "政府", type: WordType.NOUN },
  
  // Basic Nouns (Review)
  { text: "Friend", jp: "友達", type: WordType.NOUN },
  { text: "School", jp: "学校", type: WordType.NOUN },
  { text: "Library", jp: "図書館", type: WordType.NOUN },

  // --- VERBS (動詞) ---
  { text: "Consider", jp: "よく考える", type: WordType.VERB },
  { text: "Encourage", jp: "励ます", type: WordType.VERB },
  { text: "Recognize", jp: "認識する", type: WordType.VERB },
  { text: "Establish", jp: "設立する", type: WordType.VERB },
  { text: "Improve", jp: "改善する", type: WordType.VERB },
  { text: "Provide", jp: "提供する", type: WordType.VERB },
  { text: "Suggest", jp: "提案する", type: WordType.VERB },
  { text: "Describe", jp: "描写する", type: WordType.VERB },
  { text: "Realize", jp: "気づく", type: WordType.VERB },
  { text: "Produce", jp: "生産する", type: WordType.VERB },
  { text: "Protect", jp: "保護する", type: WordType.VERB },
  { text: "Develop", jp: "開発する", type: WordType.VERB },
  { text: "Expect", jp: "予期する", type: WordType.VERB },
  { text: "Prepare", jp: "準備する", type: WordType.VERB },
  { text: "Decide", jp: "決める", type: WordType.VERB },
  { text: "Accept", jp: "受け入れる", type: WordType.VERB },
  { text: "Refuse", jp: "断る", type: WordType.VERB },
  { text: "Survive", jp: "生き残る", type: WordType.VERB },
  { text: "Mention", jp: "言及する", type: WordType.VERB },
  { text: "Require", jp: "必要とする", type: WordType.VERB },

  // Basic Verbs (Review)
  { text: "Become", jp: "〜になる", type: WordType.VERB },
  { text: "Believe", jp: "信じる", type: WordType.VERB },
  { text: "Travel", jp: "旅行する", type: WordType.VERB },

  // --- ADJECTIVES (形容詞) ---
  { text: "Efficient", jp: "効率的な", type: WordType.ADJECTIVE },
  { text: "Essential", jp: "不可欠な", type: WordType.ADJECTIVE },
  { text: "Various", jp: "様々な", type: WordType.ADJECTIVE },
  { text: "Obvious", jp: "明らかな", type: WordType.ADJECTIVE },
  { text: "Positive", jp: "肯定的な", type: WordType.ADJECTIVE },
  { text: "Negative", jp: "否定的な", type: WordType.ADJECTIVE },
  { text: "Familiar", jp: "よく知られた", type: WordType.ADJECTIVE },
  { text: "Ordinary", jp: "普通の", type: WordType.ADJECTIVE },
  { text: "Similar", jp: "似ている", type: WordType.ADJECTIVE },
  { text: "Recent", jp: "最近の", type: WordType.ADJECTIVE },
  { text: "Likely", jp: "ありそうな", type: WordType.ADJECTIVE },
  { text: "Serious", jp: "深刻な", type: WordType.ADJECTIVE },
  { text: "Mental", jp: "精神の", type: WordType.ADJECTIVE },
  { text: "Physical", jp: "身体の", type: WordType.ADJECTIVE },
  { text: "Correct", jp: "正しい", type: WordType.ADJECTIVE },
  { text: "Complex", jp: "複雑な", type: WordType.ADJECTIVE },
  { text: "Creative", jp: "創造的な", type: WordType.ADJECTIVE },
  { text: "Private", jp: "私的な", type: WordType.ADJECTIVE },
  { text: "Public", jp: "公の", type: WordType.ADJECTIVE },
  { text: "Common", jp: "共通の", type: WordType.ADJECTIVE },

  // Basic Adjectives (Review)
  { text: "Busy", jp: "忙しい", type: WordType.ADJECTIVE },
  { text: "Hungry", jp: "お腹が空いた", type: WordType.ADJECTIVE },
  { text: "Famous", jp: "有名な", type: WordType.ADJECTIVE },
];

// Imabari Related Vocabulary
export const IMABARI_WORD_LIST: WordData[] = [
  // --- Nouns (Geographical & Industrial) ---
  { text: "Towel", jp: "タオル", type: WordType.NOUN },
  { text: "Bridge", jp: "橋", type: WordType.NOUN },
  { text: "Island", jp: "島", type: WordType.NOUN },
  { text: "Ship", jp: "船", type: WordType.NOUN },
  { text: "Castle", jp: "城", type: WordType.NOUN },
  { text: "Sea", jp: "海", type: WordType.NOUN },
  { text: "Port", jp: "港", type: WordType.NOUN },
  { text: "Cyclist", jp: "サイクリスト", type: WordType.NOUN },
  { text: "Pirate", jp: "海賊", type: WordType.NOUN },
  { text: "Strait", jp: "海峡", type: WordType.NOUN },
  { text: "Iron", jp: "鉄", type: WordType.NOUN },
  { text: "Industry", jp: "産業", type: WordType.NOUN },
  { text: "Shrine", jp: "神社", type: WordType.NOUN },
  { text: "Pilgrimage", jp: "巡礼/遍路", type: WordType.NOUN },
  { text: "Mandarin(Mikan)", jp: "みかん", type: WordType.NOUN },
  { text: "Route", jp: "ルート/道", type: WordType.NOUN },
  { text: "Ferry", jp: "フェリー", type: WordType.NOUN },
  { text: "Crane", jp: "クレーン", type: WordType.NOUN },
  { text: "Sunset", jp: "夕日", type: WordType.NOUN },
  
  // --- Verbs (Action & Industry) ---
  { text: "Build", jp: "造る(船などを)", type: WordType.VERB },
  { text: "Ride", jp: "乗る(自転車に)", type: WordType.VERB },
  { text: "Cross", jp: "渡る", type: WordType.VERB },
  { text: "Connect", jp: "つなぐ", type: WordType.VERB },
  { text: "Flow", jp: "流れる", type: WordType.VERB },
  { text: "Visit", jp: "訪れる", type: WordType.VERB },
  { text: "Navigate", jp: "航行する", type: WordType.VERB },
  { text: "Manufacture", jp: "製造する", type: WordType.VERB },
  { text: "Export", jp: "輸出する", type: WordType.VERB },
  { text: "Dye", jp: "染める", type: WordType.VERB },
  { text: "Pray", jp: "祈る", type: WordType.VERB },
  { text: "Explore", jp: "探検する", type: WordType.VERB },

  // --- Adjectives (Descriptive) ---
  { text: "Local", jp: "地元の", type: WordType.ADJECTIVE },
  { text: "Beautiful", jp: "美しい", type: WordType.ADJECTIVE },
  { text: "Famous", jp: "有名な", type: WordType.ADJECTIVE },
  { text: "Long", jp: "長い", type: WordType.ADJECTIVE },
  { text: "Narrow", jp: "狭い", type: WordType.ADJECTIVE },
  { text: "Delicious", jp: "おいしい", type: WordType.ADJECTIVE },
  { text: "Blue", jp: "青い", type: WordType.ADJECTIVE },
  { text: "Scenic", jp: "景色の良い", type: WordType.ADJECTIVE },
  { text: "Historical", jp: "歴史的な", type: WordType.ADJECTIVE },
  { text: "Marine", jp: "海の", type: WordType.ADJECTIVE },
  { text: "Peaceful", jp: "穏やかな", type: WordType.ADJECTIVE },
  { text: "Industrial", jp: "工業の", type: WordType.ADJECTIVE },
  { text: "Magnificent", jp: "壮大な", type: WordType.ADJECTIVE },
  { text: "Traditional", jp: "伝統的な", type: WordType.ADJECTIVE },
];

export const INITIAL_HP = 5;
export const SPAWN_RATE_MS = 2000;
export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;