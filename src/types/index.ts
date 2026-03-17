// src/types/index.ts

export interface NewsItem {
  id: number;
  statement: string; // Headline
  background: string; // Description or context
  importance: string; // "High", "Medium", etc.
  relevance: string; // "Global", "Local", etc.
  fullContent?: string; // Content of the article
  sourceUrl?: string; // Link to original article
  sourceName?: string; // Publisher name
  publishedAt?: string; // ISO date string
}
