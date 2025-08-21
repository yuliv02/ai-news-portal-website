// src/components/newsApi.ts

export interface Article {
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

// Ambil API key dari .env
const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const GUARDIAN_KEY = import.meta.env.VITE_GUARDIAN_KEY;
const NYT_KEY = import.meta.env.VITE_NYT_KEY;

// ---- NEWSAPI ----
async function fetchFromNewsAPI(): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=ai&language=en&sortBy=publishedAt&apiKey=${NEWSAPI_KEY}`
    );
    const data = await res.json();
    if (!data.articles) return [];

    return data.articles.map((a: any, index: number) => ({
      id: `newsapi-${index}`,
      title: a.title || "No title",
      description: a.description || "",
      author: a.author || "Unknown",
      publishedAt: a.publishedAt,
      readTime: "5 min",
      category: "AI",
      source: a.source?.name || "NewsAPI",
      url: a.url,
      urlToImage: a.urlToImage || "",
      views: "0",
    }));
  } catch (err) {
    console.error("❌ Error NewsAPI:", err);
    return [];
  }
}

// ---- GUARDIAN ----
async function fetchFromGuardian(): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://content.guardianapis.com/search?q=ai&api-key=${GUARDIAN_KEY}&show-fields=thumbnail,trailText,byline`
    );
    const data = await res.json();
    if (!data.response?.results) return [];

    return data.response.results.map((a: any, index: number) => ({
      id: `guardian-${index}`,
      title: a.webTitle || "No title",
      description: a.fields?.trailText || "",
      author: a.fields?.byline || "Unknown",
      publishedAt: a.webPublicationDate,
      readTime: "5 min",
      category: "AI",
      source: "The Guardian",
      url: a.webUrl,
      urlToImage: a.fields?.thumbnail || "",
      views: "0",
    }));
  } catch (err) {
    console.error("❌ Error Guardian:", err);
    return [];
  }
}

// ---- NEW YORK TIMES ----
async function fetchFromNYT(): Promise<Article[]> {
  try {
    const res = await fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=ai&api-key=${NYT_KEY}`
    );
    const data = await res.json();
    if (!data.response?.docs) return [];

    return data.response.docs.map((a: any, index: number) => ({
      id: `nyt-${index}`,
      title: a.headline?.main || "No title",
      description: a.abstract || "",
      author: a.byline?.original || "Unknown",
      publishedAt: a.pub_date,
      readTime: "5 min",
      category: "AI",
      source: "New York Times",
      url: a.web_url,
      urlToImage: a.multimedia && a.multimedia.length
        ? `https://www.nytimes.com/${a.multimedia[0].url}`
        : "",
      views: "0",
    }));
  } catch (err) {
    console.error("❌ Error NYT:", err);
    return [];
  }
}

// ---- COMBINED FETCH ----
export async function fetchNewsFromAPI(): Promise<Article[]> {
  try {
    const [newsapi, guardian, nyt] = await Promise.all([
      fetchFromNewsAPI(),
      fetchFromGuardian(),
      fetchFromNYT(),
    ]);

    console.log("✅ NewsAPI:", newsapi.length);
    console.log("✅ Guardian:", guardian.length);
    console.log("✅ NYT:", nyt.length);

    const allArticles = [...newsapi, ...guardian, ...nyt];

    return allArticles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (err) {
    console.error("Error fetching multiple APIs:", err);
    return [];
  }
}
