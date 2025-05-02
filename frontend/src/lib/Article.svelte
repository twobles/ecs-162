<script context="module" lang="ts">
  // Formatted Article interface
  export interface Article {
    headline: string;
    url: string;
    snippet: string;
    published: Date;
    img_cap: string;
    img_url: string;
  }

  // https://developer.nytimes.com/docs/articlesearch-product/1/routes/articlesearch.json/get
  interface Docs {
    headline: { 
      main: string  
    };
    web_url: string;
    snippet: string;
    pub_date: string;
    multimedia: {
      caption: string;
      default: {
        url: string,
        height: number,
        width: number
      };
    };
  }

  interface Response {
    response: {
      docs: Docs[];
    };
  }
  /**
   * Fetches api key
   * 
   * @param None
   * @returns A string api key
   */
  export async function fetchApiKey(): Promise<string> {
    let apiKey: string = '';
    try {
      const res = await fetch('/api/key');
      if (!res.ok) {
        console.error('Failed to fetch API key. Status:', res.status);
        return '';
      }
      const data = await res.json();
      apiKey = data.apiKey;
      return apiKey;
    } catch (error) {
      console.error('Failed to fetch API key:', error);
      return '';
    }
  }

  /**
   * Fetches articles in the Sacramento area
   * 
   * @param api_key - Key to access the NYT API
   * @returns An array of articles formatted as Article
   */
  export async function fetchArticles(api_key: string, page: number): Promise<Article[]> {
    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&fq=timesTag.location%3A"Sacramento%20(Calif)"&page=${page}&sort=newest&api-key=${api_key}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch articles: ' + response.statusText);
    }

    const data: Response = await response.json();

    return data.response.docs.map(doc => ({
      headline: doc.headline.main,
      url: doc.web_url,
      snippet: doc.snippet,
      published: new Date(doc.pub_date),
      img_cap: doc.multimedia.caption,
      img_url: doc.multimedia.default.url,
    }));
  }
</script>