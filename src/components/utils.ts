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
}

export function filterArticles(articles: Article[], searchTerm: string, selectedCategory: string): Article[] {
  let filtered = articles;
  
  if (searchTerm) {
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (selectedCategory !== 'all' && selectedCategory !== 'Trending') {
    filtered = filtered.filter(article =>
      article.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }
  
  return filtered;
}