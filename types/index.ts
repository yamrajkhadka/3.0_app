export interface Message {
  type: 'user' | 'ai';
  text: string;
  sources?: LegalSource[];
  timestamp: number;
}

export interface LegalSource {
  law: string;
  section: string;
  section_title: string;
  text: string;
  rel_score?: number;
}

export interface ApiResponse {
  answer: string;
  sources: LegalSource[];
  query: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
