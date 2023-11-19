import createMetascraper from "metascraper";
import metascraperAuthor from "metascraper-author";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperTitle from "metascraper-title";
import metascraperUrl from "metascraper-url";



export default async function getMeta(html, url) {
  const metascraper = createMetascraper([
    metascraperAuthor(),
    metascraperDescription(),
    metascraperImage(),
    metascraperTitle(),
    metascraperUrl(),
  ]);
  let info = await metascraper({ html, url });
  console.log(info);
  return info;
}