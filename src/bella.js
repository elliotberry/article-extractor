
const unique = (arr = []) => {
    return [...new Set(arr)]
}

const stripTags = (s) => {
    return toString(s)
        .replace(/(<([^>]+)>)/gi, '')
        .trim()
}
const truncate = (s, len = 140) => {
    const txt = toString(s)
    const txtlen = txt.length
    if (txtlen <= len) {
        return txt
    }
    const subtxt = txt.substring(0, len).trim()
    const subtxtArr = subtxt.split(' ')
    const subtxtLen = subtxtArr.length
    if (subtxtLen > 1) {
        subtxtArr.pop()
        return subtxtArr.map((word) => word.trim()).join(' ') + '...'
    }
    return subtxt.substring(0, len - 3) + '...'
}
export const escapeHTML = (s) => {
    return toString(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}
const pick = (arr = [], count = 1) => {
    const a = shuffle(arr);
    const mc = Math.max(1, count);
    const c = Math.min(mc, a.length - 1);
    return a.splice(0, c);
  };
  
  const ob2Str = val => {
    return {}.toString.call(val);
  };
  

  
  const isArray = val => {
    return Array.isArray(val);
  };
  
  
  const isNull = val => {
    return ob2Str(val) === '[object Null]';
  };
  
  const isUndefined = val => {
    return ob2Str(val) === '[object Undefined]';
  };
  
  const isNil = val => {
    return isUndefined(val) || isNull(val);
  };
  
  const isFunction = val => {
    return ob2Str(val) === '[object Function]';
  };
  


  const pipe = (...fns) => {
    return fns.reduce((f, g) => (x) => g(f(x)))
  }
export {
  stripTags, truncate, unique, pipe, isArray, isFunction
}
