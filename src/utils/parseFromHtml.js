// utils -> parseFromHtml

import { stripTags, truncate, unique, pipe } from 'bellajs'

import { purify, cleanify } from './html.js'

import {
  isValid as isValidUrl,
  purify as purifyUrl,
  absolutify as absolutifyUrl,
  normalize as normalizeUrls,
  chooseBestUrl,
  getDomain
} from './linker.js'

import extractMetaData from './extractMetaData.js'

import extractWithReadability, {
  extractTitleWithReadability
} from './extractWithReadability.js'

import { execPreParser, execPostParser } from './transformation.js'

import getTimeToRead from './getTimeToRead.js'

const summarize = (desc, txt, threshold, maxlen) => { // eslint-disable-line
  return desc.length > threshold
    ? desc
    : truncate(txt, maxlen).replace(/\n/g, ' ')
}
const urlBullshit = (urls, title) => {
  // gather urls to choose the best url later
  const links = unique(urls.filter(isValidUrl).map(purifyUrl))



  // choose the best url, which one looks like title the most
  const bestUrl = chooseBestUrl(links, title)
  return {bestUrl, links}
}
const parseFromHtml = async ({html, url, parserOptions}) => {

  const theHtml = await purify(html)
  const meta = await extractMetaData(theHtml)
 

  const {
    shortlink,
    amphtml,
    canonical,
    description: metaDesc,
    image: metaImg,
    author,
    published,
  } = meta

  const {
    wordsPerMinute = 300,
    descriptionTruncateLen = 210,
    descriptionLengthThreshold = 180,
    contentLengthThreshold = 200,
  } = parserOptions
  let title;
  // gather title
  if (meta.title === '' && url !== '') {
    title = extractTitleWithReadability(html, url)
  }


  let {bestUrl, links} = urlBullshit([    ...shortlink,
    ...amphtml,
    ...canonical, ...url], title)

  const fns = pipe(
    (input) => {
      try {
      return normalizeUrls(input, bestUrl)
      } catch(e) {
        console.log(e)
      }
    },
    (input) => {
      try {
      return execPreParser(input, links)
    } catch(e) {
      console.log(e)
    }
    },
    (input) => {
      try {
      return extractWithReadability(input, bestUrl)
    } catch(e) {
      console.log(e)
    }
    },
    (input) => {
      try {
      return input ? execPostParser(input, links) : null
    } catch(e) {
      console.log(e)
    }
    },
    (input) => {
      try {
      return input ? cleanify(input) : null
    } catch(e) {
      console.log(e)
    }
    }
  )

  const content = fns(html)

  if (!content) {
    return null
  }

  const textContent = stripTags(content)
  if (textContent.length < contentLengthThreshold) {
    return null
  }

  const description = summarize(
    metaDesc,
    textContent,
    descriptionLengthThreshold,
    descriptionTruncateLen
  )

  const image = metaImg ? absolutifyUrl(bestUrl, metaImg) : ''

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
  }
}
export default parseFromHtml
