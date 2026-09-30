export interface ContentRequest {
  topic: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'expert' | 'friendly';
  format: 'article' | 'social-post' | 'email' | 'linkedin' | 'twitter';
  length: 'short' | 'medium' | 'long';
  keywords?: string[];
  cta?: string;
}

export interface GeneratedContent {
  id: string;
  title: string;
  body: string;
  metaDescription?: string;
  hashtags?: string[];
  format?: ContentRequest['format'];
  tone?: ContentRequest['tone'];
  length?: ContentRequest['length'];
  wordCount: number;
  readingTime: number;
  seoScore: number;
  createdAt: Date;
}

export interface ContentPipelineResponse {
  success: boolean;
  data?: GeneratedContent;
  error?: string;
}

export interface CSVExportOptions {
  includeMetadata: boolean;
  dateFormat: 'ISO' | 'locale';
  delimiter: ',' | ';';
}