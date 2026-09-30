/**
 * TradeJournall - Default Master SEO Articles
 * Location: src/utils/defaultArticles.ts
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  date: string;
  author: string;
  category: string;
  readingTime: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export const DEFAULT_BLOG_POSTS: BlogPost[] = [];
