import { load } from 'cheerio';
import axios from 'axios';

export async function getMetaTags(
  url: string,
): Promise<{ [key: string]: string } | null> {
  try {
    const response = await axios.get(url);
    const $ = load(response.data);
    const metaTags: { [key: string]: string } = {};

    $('meta').each((_, element) => {
      const property = $(element).attr('property') || $(element).attr('name');
      if (property && property.startsWith('og:')) {
        const content = $(element).attr('content') || '';
        metaTags[property.replace('og:', '')] = content;
      }
    });

    return metaTags;
  } catch (err) {
    console.error(err);
    return null;
  }
}
