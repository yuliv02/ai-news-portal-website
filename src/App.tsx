import React, { useEffect, useState } from 'react';
import { ArticlesList } from './components/ArticlesList';
import { CategoryFilter } from './components/CategoryFilter';
import { Header } from './components/Header';
import { Article, fetchNewsFromAPI } from './components/newsApi';
import { SearchBar } from './components/SearchBar';
import { filterArticles } from './components/utils';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch real API news
  const loadNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching news from NewsAPI...');
      const newsData = await fetchNewsFromAPI();
      setArticles(newsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch news articles. Please try again.');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + refresh every 5 min
  useEffect(() => {
    loadNews();
    const interval = setInterval(() => {
      loadNews();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter articles when search/category changes
  useEffect(() => {
    const filtered = filterArticles(articles, searchTerm, selectedCategory);
    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory, articles]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRefresh = () => {
    loadNews();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700">
      <Header />
      <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      
      {error && (
        <div className="px-4 md:px-6 mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <p className="text-red-200 mb-2">{error}</p>
              <button 
                onClick={handleRefresh}
                className="text-red-100 hover:text-white underline text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ArticlesList 
        articles={filteredArticles} 
        loading={loading}
        onRefresh={handleRefresh}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}
