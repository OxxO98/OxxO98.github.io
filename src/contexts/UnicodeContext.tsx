import { createContext } from 'react';

export const UnicodeContext = createContext<UnicodeContext>({
  kanji : /[\u3400-\u9fff\u3005]+/g,
  kanjiStart : /^[\u3400-\u9fff\u3005]+/g,
  kanjiEnd : /[\u3400-\u9fff\u3005]+$/g,
  hiragana : /[^\u3400-\u9fff\u3005]+/g,
  okuri : /(?<any>.*)(?<kanji>[\u3400-\u9fff]+)(?<okuri>[^\u3400-\u9fff]+)$/
})

export const UnicodeRangeContext = createContext<UnicodeRangeContext>({
  kanji : '\\u3400-\\u9fff\u3005',
  hiragana : '\\3040-\\u309f',
  katakana : '\\u30a0-\\u30ff'
})
