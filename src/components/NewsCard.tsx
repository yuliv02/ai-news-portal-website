import { AlertCircle, Bookmark, CheckCircle, Clock, ExternalLink, Eye, Share2 } from 'lucide-react';
import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

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

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copying' | 'copied'>('idle');
  const [imageError, setImageError] = useState(false);

  const handleArticleClick = () => {
    // In a real implementation, this would open the article URL
    // For demo purposes, we'll simulate opening the article
    console.log('Opening article:', article.title);
    window.open(article.url, '_blank');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareStatus('copying');
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
        setShareStatus('copied');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${article.title} - ${article.url}`);
        setShareStatus('copied');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setShareStatus('idle');
    }
    
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // In a real implementation, this would save to user's bookmarks
    console.log(isBookmarked ? 'Removed bookmark:' : 'Bookmarked:', article.title);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      case 'Machine Learning': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'Neural Networks': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      case 'Automation': return 'bg-green-100 text-green-700 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const getSourceColor = (source: string) => {
    if (source.includes('TechNews')) return 'text-blue-600';
    if (source.includes('Guardian')) return 'text-purple-600';
    if (source.includes('NY Times')) return 'text-gray-600';
    return 'text-gray-500';
  };

  return (
    <Card 
      className="bg-white/95 backdrop-blur-sm border-white/20 hover:bg-white hover:shadow-xl hover:shadow-black/10 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={handleArticleClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleArticleClick();
        }
      }}
      aria-label={`Read article: ${article.title}`}
    >
      <CardContent className="p-0">
        {/* Mobile Layout - Stacked */}
        <div className="block sm:hidden">
          {/* Image */}
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden relative">
            {!imageError ? (
              <ImageWithFallback
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="text-center text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">AI News Image</p>
                </div>
              </div>
            )}
            
            {/* Source badge overlay */}
            <div className="absolute top-3 left-3">
              <Badge 
                variant="secondary" 
                className="bg-white/90 backdrop-blur-sm text-xs px-2 py-1 shadow-sm"
              >
                {article.source.replace(' API', '')}
              </Badge>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <Badge 
                variant="secondary" 
                className={`text-xs px-2 py-1 ${getCategoryColor(article.category)}`}
              >
                {article.category}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 transition-all ${
                    isBookmarked 
                      ? 'text-yellow-600 opacity-100' 
                      : 'opacity-60 group-hover:opacity-100'
                  }`}
                  onClick={handleBookmark}
                  aria-label="Bookmark article"
                >
                  <Bookmark className={`h-3 w-3 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-60 group-hover:opacity-100 transition-opacity"
                  onClick={handleShare}
                  aria-label="Share article"
                  disabled={shareStatus !== 'idle'}
                >
                  {shareStatus === 'copied' ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <Share2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            <h3 className="font-medium text-base leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {article.description}
            </p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium truncate max-w-32">{article.author}</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(article.publishedAt)}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet Layout - Side by side */}
        <div className="hidden sm:flex gap-4 p-4">
          {/* Article Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden relative">
              {!imageError ? (
                <ImageWithFallback
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                  <div className="text-center text-gray-500">
                    <AlertCircle className="h-6 w-6 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">AI</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-1 ${getCategoryColor(article.category)}`}
                >
                  {article.category}
                </Badge>
                <span className={`text-xs font-medium ${getSourceColor(article.source)}`}>
                  {article.source.replace(' API', '')}
                </span>
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 transition-all ${
                    isBookmarked 
                      ? 'text-yellow-600 opacity-100' 
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                  onClick={handleBookmark}
                  aria-label="Bookmark article"
                >
                  <Bookmark className={`h-3 w-3 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleShare}
                  aria-label="Share article"
                  disabled={shareStatus !== 'idle'}
                >
                  {shareStatus === 'copied' ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <Share2 className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick();
                  }}
                  aria-label="Open article in new tab"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <h3 className="font-medium text-sm md:text-base lg:text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {article.title}
            </h3>

            <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 lg:line-clamp-3">
              {article.description}
            </p>

            {/* Tags - Desktop only */}
            {article.tags && article.tags.length > 0 && (
              <div className="hidden lg:flex flex-wrap gap-1 mb-3">
                {article.tags.slice(0, 4).map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span className="font-medium truncate max-w-24 md:max-w-32">{article.author}</span>
                <span className="hidden md:inline">{formatDate(article.publishedAt)}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}