/**
 * TradeJournall - Blog Topic Image Resolver
 * Resolves crystal-clear, high-resolution, topic-matched images for blog posts
 * based on keyword analysis of title and category.
 */

export interface BlogTopicImage {
  url: string;
  alt: string;
}

const TOPIC_IMAGES: Record<string, BlogTopicImage> = {
  brokerage: {
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Stock Market Brokerage Calculator & Trading Desk',
  },
  zerodha: {
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Zerodha Stock Market Trading Charts',
  },
  groww: {
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Groww Stock & Mutual Fund Charges Breakdown',
  },
  cryptoTax: {
    url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
    alt: 'Crypto 30 Percent Tax and 1 Percent TDS Calculator',
  },
  futures: {
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Crypto Futures Leverage PnL Calculator',
  },
  options: {
    url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Option Trading Net Profit Breakeven Calculator',
  },
  psychology: {
    url: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=1200&q=80',
    alt: 'Trader Psychology & Discipline Journaling',
  },
  risk: {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Risk Management & Position Sizing Calculator',
  },
  binance: {
    url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Binance & Crypto Exchange Trading Journal',
  },
  default: {
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    alt: 'TradeJournall Financial Analytics',
  },
};

/**
 * Returns a high-definition, topic-matched image URL for any blog post.
 */
export function getTopicRelevantImage(title: string = '', category: string = '', fallbackUrl?: string): string {
  if (fallbackUrl && fallbackUrl.trim() !== '' && !fallbackUrl.includes('placeholder')) {
    return fallbackUrl;
  }

  const text = `${title} ${category}`.toLowerCase();

  if (text.includes('brokerage') || text.includes('zerodha') || text.includes('groww') || text.includes('broker')) {
    return TOPIC_IMAGES.brokerage.url;
  }
  if (text.includes('tax') || text.includes('tds') || text.includes('115bbh') || text.includes('194s')) {
    return TOPIC_IMAGES.cryptoTax.url;
  }
  if (text.includes('future') || text.includes('leverage') || text.includes('delta') || text.includes('coindcx')) {
    return TOPIC_IMAGES.futures.url;
  }
  if (text.includes('option') || text.includes('breakeven') || text.includes('call') || text.includes('put')) {
    return TOPIC_IMAGES.options.url;
  }
  if (text.includes('binance') || text.includes('crypto') || text.includes('bitcoin')) {
    return TOPIC_IMAGES.binance.url;
  }
  if (text.includes('psychology') || text.includes('fomo') || text.includes('discipline') || text.includes('mindset')) {
    return TOPIC_IMAGES.psychology.url;
  }
  if (text.includes('risk') || text.includes('size') || text.includes('position') || text.includes('ratio')) {
    return TOPIC_IMAGES.risk.url;
  }

  return TOPIC_IMAGES.default.url;
}
