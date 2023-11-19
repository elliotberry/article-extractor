import {stripTags, truncate, unique} from './bella.js';

import {purify, cleanify} from './html.js';

import {isValid as isValidUrl, purify as purifyUrl, absolutify as absolutifyUrl, normalize as normalizeUrls, chooseBestUrl, getDomain} from './linker.js';

import extractMetaData from './extractMetaData.js';

import extractWithReadability, {extractTitleWithReadability} from './extractWithReadability.js';

import {execPreParser, execPostParser} from './transformation.js';

import getTimeToRead from './getTimeToRead.js';

const summarize = (desc, txt, threshold, maxlen) => {
  return desc.length > threshold ? desc : truncate(txt, maxlen).replace(/\n/g, ' ');
};



const optionsdefault = {
  wordsPerMinute: 300,
  descriptionTruncateLen: 210,
  descriptionLengthThreshold: 180,
  contentLengthThreshold: 200,
  titleLengthThreshold: 50,
  titleTruncateLen: 50,
  imageLengthThreshold: 50,
  imageTruncateLen: 50,
  authorLengthThreshold: 50,
  authorTruncateLen: 50,
  publishedLengthThreshold: 50,
  purify: false,
};

const getTitle = async (meta, html) => {
  let title = meta.title || '';

  if (title === '') {
    title = await extractTitleWithReadability(html);
  }
  return title;
};

const urlWitchcraft = async (url, meta, title) => {
  const urlList = [url, ...meta.shortlink, ...meta.amphtml, ...meta.canonical];

  let bestUrl = '';
  let links = [];
  if (urlList.length > 0) {
    links = unique(urlList.filter(isValidUrl).map(purifyUrl));
    if (links.length > 0 && title !== '') {
      bestUrl = chooseBestUrl(links, title);
    }
  }
  return {bestUrl, links};
};
const parseFromHtml = async ({html, url, parserOptions}) => {
  //get options and mix with default options
  parserOptions = Object.assign({}, optionsdefault, parserOptions);
  const {wordsPerMinute, descriptionTruncateLen, descriptionLengthThreshold, contentLengthThreshold} = parserOptions;

  //purify HTML
  if (parserOptions.purify) {
    html = await purify(html);
  }

  const meta = await extractMetaData(html);

  const {description: metaDesc, image: metaImg, author, published} = meta;
  const title = await getTitle(meta, html);
  const {bestUrl, links} = await urlWitchcraft(url, meta, title);
  console.log(`bestUrl: ${bestUrl}, links: ${links}, title: ${title}, metaDesc: ${metaDesc}, metaImg: ${metaImg}, author: ${author}, published: ${published}`);



  async function pipey(input) {
     
          input = await normalizeUrls(input, bestUrl);
          input = await execPreParser(input, links);
          input = await extractWithReadability(input, bestUrl);
          input = await execPostParser(input, links);
          input = await cleanify(input);
          return input;
  }
 

  const content = await pipey(html);

  const textContent = stripTags(content);
  if (textContent.length < contentLengthThreshold) {
    // return null;
  }

  const description = summarize(metaDesc, textContent, descriptionLengthThreshold, descriptionTruncateLen);

  const image = metaImg ? absolutifyUrl(bestUrl, metaImg) : '';

  return {
    url: bestUrl,
    title,
    description,
    links,
    image,
    content,
    author,
    source: getDomain(bestUrl),
    published,
    ttr: getTimeToRead(textContent, wordsPerMinute),
  };
};
export default parseFromHtml;
