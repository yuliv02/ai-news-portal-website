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

const NEWSAPI_KEY = "ebf9c6bc8e5d48e38f78d395cd1ac847";
const GUARDIAN_KEY = "622f67a9-cd83-4669-b467-d0d14dc13f11";
const NYT_KEY = "TiAK2klxIXKV5QMTjcmbXVfhHUP5QnYv";

// ---- NEWSAPI ----
async function fetchFromNewsAPI(): Promise<Article[]> {
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
}

// ---- GUARDIAN ----
async function fetchFromGuardian(): Promise<Article[]> {
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
}

// ---- NEW YORK TIMES ----
async function fetchFromNYT(): Promise<Article[]> {
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
    urlToImage: a.multimedia?.length
      ? `https://www.nytimes.com/${a.multimedia[0].url}`
      : "",
    views: "0",
  }));
}

// ---- COMBINED FETCH ----
export async function fetchNewsFromAPI(): Promise<Article[]> {
  try {
    const [newsapi, guardian, nyt] = await Promise.all([
      fetchFromNewsAPI(),
      fetchFromGuardian(),
      fetchFromNYT(),
    ]);

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
