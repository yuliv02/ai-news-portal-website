import { Clock, Loader2, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { Button } from './ui/button';

interface Article {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  source: string;
  url: string;
  urlToImage: string;
  views: string;
  tags?: string[];
}

interface ArticlesListProps {
  articles: Article[];
  loading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: Date;
}

export function ArticlesList({ articles, loading = false, onRefresh, lastUpdated }: ArticlesListProps) {
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getSourceStats = () => {
    const sources = articles.reduce((acc, article) => {
      const sourceName = article.source.replace(' API', '');
      acc[sourceName] = (acc[sourceName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(sources)
      .map(([name, count]) => `${name} (${count})`)
      .join(' • ');
  };

  return (
    <div className="px-4 md:px-6 pb-8 lg:pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-white text-lg md:text-xl flex items-center gap-2">
              <span className="text-blue-200">✨</span>
              Latest AI News
            </h2>
            {loading && <Loader2 className="h-4 w-4 text-white animate-spin" />}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            {lastUpdated && (
              <div className="flex items-center gap-1 text-purple-200 text-xs">
                <Clock className="h-3 w-3" />
                <span>Updated {formatLastUpdated(lastUpdated)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 h-8"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8">
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">All</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Source info */}
        <div className="mb-6">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse bg-white/20 h-4 w-32 rounded"></div>
              <WifiOff className="h-4 w-4 text-purple-300" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-purple-200 text-sm flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  {articles.length} articles from multiple sources
                </p>
                <div className="hidden md:block text-purple-300 text-xs">
                  {getSourceStats()}
                </div>
              </div>
              <div className="md:hidden">
                <p className="text-purple-300 text-xs">{getSourceStats()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Articles grid */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/10 animate-pulse rounded-lg overflow-hidden h-32"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${Math.min(index * 50, 500)}ms`, animationFillMode: 'forwards' }}
              >
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white">No AI news found. Try refreshing.</p>
          </div>
        )}

        {/* Footer */}
        {!loading && articles.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center text-purple-300 text-xs">
              <p className="mb-2">Data sources: NewsAPI • The Guardian • New York Times</p>
              <p>
                Articles are refreshed every 5 minutes • Last update:{" "}
                {lastUpdated ? formatLastUpdated(lastUpdated) : "Unknown"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
