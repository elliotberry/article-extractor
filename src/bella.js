const clone = (val, history = null) => {
  const stack = history || new Set();

  if (stack.has(val)) {
    return val;
  }

  stack.add(val);

  if (isDate(val)) {
    return new Date(val.valueOf());
  }

  const copyObject = o => {
    const oo = Object.create({});
    for (const k in o) {
      if (hasProperty(o, k)) {
        oo[k] = clone(o[k], stack);
      }
    }
    return oo;
  };

  const copyArray = a => {
    return [...a].map(e => {
      if (isArray(e)) {
        return copyArray(e);
      } else if (isObject(e)) {
        return copyObject(e);
      }
      return clone(e, stack);
    });
  };

  if (isArray(val)) {
    return copyArray(val);
  }

  if (isObject(val)) {
    return copyObject(val);
  }

  return val;
};

const copies = (source, dest, matched = false, excepts = []) => {
  for (const k in source) {
    if (excepts.length > 0 && excepts.includes(k)) {
      continue; // eslint-disable-line no-continue
    }
    if (!matched || (matched && hasProperty(dest, k))) {
      const oa = source[k];
      const ob = dest[k];
      if ((isObject(ob) && isObject(oa)) || (isArray(ob) && isArray(oa))) {
        dest[k] = copies(oa, dest[k], matched, excepts);
      } else {
        dest[k] = clone(oa);
      }
    }
  }
  return dest;
};

const unique = (arr = []) => {
  return [...new Set(arr)];
};

const fnSort = (a, b) => {
  return a > b ? 1 : a < b ? -1 : 0;
};
export const stripTags = (s) => {
  return toString(s).replace(/(<([^>]+)>)/ig, '').trim()
}
export const truncate = (s, len = 140) => {
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
    return subtxtArr.map(word => word.trim()).join(' ') + '...'
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
const sort = (arr = [], sorting = null) => {
  const tmp = [...arr];
  const fn = sorting || fnSort;
  tmp.sort(fn);
  return tmp;
};

const sortBy = (arr = [], order = 1, key = '') => {
  if (!isString(key) || !hasProperty(arr[0], key)) {
    return arr;
  }
  return sort(arr, (m, n) => {
    return m[key] > n[key] ? order : m[key] < n[key] ? -1 * order : 0;
  });
};

const shuffle = (arr = []) => {
  const input = [...arr];
  const output = [];
  let inputLen = input.length;
  while (inputLen > 0) {
    const index = Math.floor(Math.random() * inputLen);
    output.push(input.splice(index, 1)[0]);
    inputLen--;
  }
  return output;
};

const pick = (arr = [], count = 1) => {
  const a = shuffle(arr);
  const mc = Math.max(1, count);
  const c = Math.min(mc, a.length - 1);
  return a.splice(0, c);
};

const ob2Str = val => {
  return {}.toString.call(val);
};

const isInteger = val => {
  return Number.isInteger(val);
};

const isArray = val => {
  return Array.isArray(val);
};

const isString = val => {
  return String(val) === val;
};

const isNumber = val => {
  return Number(val) === val;
};

const isBoolean = val => {
  return Boolean(val) === val;
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

const isObject = val => {
  return ob2Str(val) === '[object Object]' && !isArray(val);
};

const isDate = val => {
  return val instanceof Date && !isNaN(val.valueOf());
};

const isElement = v => {
  return ob2Str(v).match(/^\[object HTML\w*Element]$/) !== null;
};

const isLetter = val => {
  const re = /^[a-z]+$/i;
  return isString(val) && re.test(val);
};

const isEmail = val => {
  const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return isString(val) && re.test(val);
};

const isEmpty = val => {
  return !val || isNil(val) || (isString(val) && val === '') || (isArray(val) && val.length === 0) || (isObject(val) && Object.keys(val).length === 0);
};

const hasProperty = (ob, k) => {
  if (!ob || !k) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(ob, k);
};
const pipe = (...fns) => {
  return fns.reduce((f, g) => (x) => g(f(x)))
}
export {
  pipe, clone, copies, unique, sort, sortBy, shuffle, pick, ob2Str, isInteger, isArray, isString, isNumber, isBoolean, isNull, isUndefined, isNil, isFunction, isObject, isDate
}
