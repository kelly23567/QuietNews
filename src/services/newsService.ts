// src/services/newsService.ts

import newsData from '../data/news.json';
import type { NewsItem } from '../types';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

export interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// Helper to clean up text
const cleanText = (text: string | null): string => {
  if (!text) return '';
  // Remove "chars" count from NewsAPI content (e.g., [+1234 chars])
  return text.replace(/\[\+\d+ chars\]$/, '');
};

// Helper to determine "importance" based on source or keywords (mock logic)
const determineImportance = (article: NewsAPIArticle): string => {
  const title = article.title.toLowerCase();
  if (title.includes('breaking') || title.includes('alert') || title.includes('urgent')) return 'Critical';
  if (article.source.name === 'BBC News' || article.source.name === 'CNN' || article.source.name === 'Reuters') return 'High';
  return ['Medium', 'High', 'Significant'][Math.floor(Math.random() * 3)];
};

// Helper to determine "relevance" (mock logic)
const determineRelevance = (_article: NewsAPIArticle): string => {
  return ['Global', 'National', 'Industry', 'Economic'][Math.floor(Math.random() * 4)];
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  // If no API key is set, return local mock data
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.warn('No API key found. Using local mock data.');
    return newsData as NewsItem[];
  }

  try {
    console.log('Fetching news from API...');
    const response = await fetch(`${BASE_URL}?country=us&apiKey=${API_KEY}`);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      // If we hit rate limits (429) or auth errors (401), fallback
      return newsData as NewsItem[];
    }

    const data = await response.json();
    
    if (data.status !== 'ok') {
      console.error(`API returned error status: ${data.message}`);
      return newsData as NewsItem[];
    }

    if (!data.articles || data.articles.length === 0) {
      console.warn('API returned no articles. Using local mock data.');
      return newsData as NewsItem[];
    }

    // Map the API response to our app's format
    return data.articles.map((article: NewsAPIArticle, index: number) => ({
      id: index + 1000, // Offset IDs to avoid conflicts
      statement: article.title || 'No Title',
      background: article.description || 'No context available.',
      importance: determineImportance(article),
      relevance: determineRelevance(article),
      fullContent: cleanText(article.content) || article.description || 'Content unavailable via API. Please visit the source.',
      sourceUrl: article.url,
      sourceName: article.source.name,
      publishedAt: article.publishedAt,
    }));

  } catch (error) {
    console.error('Error fetching news:', error);
    // Fallback to local data on error
    return newsData as NewsItem[];
  }
};
