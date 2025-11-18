import { useCallback, useContext, useMemo } from 'react';

import { UnicodeContext, UnicodeRangeContext } from 'contexts/UnicodeContext';

const hiraganaKumi = [
  ['あ', 'い', 'う', 'え', 'お', 'や', 'ゆ', 'よ'],
  ['か', 'き', 'く', 'け', 'こ', 'きゃ', 'きゅ', 'きょ'],
  ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ぎゃ', 'ぎゅ', 'ぎょ'],
  ['さ', 'し', 'す', 'せ', 'そ', 'しゃ', 'しゅ', 'しょ'],
  ['ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'じゃ', 'じゅ', 'じょ'],
  ['た', 'ち', 'つ', 'て', 'と', 'ちゃ', 'ちゅ', 'ちょ'],
  ['だ', 'ぢ', 'づ', 'で', 'ど', 'ちゃ', 'ちゅ', 'ちょ'],
  ['な', 'に', 'ぬ', 'ね', 'の', 'にゃ', 'にゅ', 'にょ'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ひゃ', 'ひゅ', 'ひょ'],
  ['ば', 'び', 'ぶ', 'べ', 'ぼ', 'びゃ', 'びゅ', 'びょ'],
  ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'ぴゃ', 'ぴゅ', 'ぴょ'],
  ['ま', 'み', 'む', 'め', 'も', 'みゃ', 'みゅ', 'みょ'],
  ['ら', 'り', 'る', 'れ', 'ろ', 'りゃ', 'りゅ', 'りょ']
]

//'ぅ'로 되는 경우의 모음은 아직 정해지지 않은 상태
const hiraganaTokubetsuKumi = [
  ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'],
  ['わ', 'うぃ', 'ぅ', 'うぇ', 'うぉ'],
  ['くぁ', 'くぃ', 'ぅ', 'くぇ', 'くぉ'],
  ['ぐぁ', 'ぐぃ', 'ぅ', 'ぐぇ', 'ぐぉ'],
  ['すぁ', 'すぃ', 'ぅ', 'しぇ', 'すぉ'],
  ['ずぁ', 'ずぃ', 'ぅ', 'じぇ', 'ずぉ'],
  ['つぁ', 'てぃ', 'とぅ', 'ちぇ', 'つぉ'],
  ['づぁ', 'でぃ', 'どぅ', 'ぢぇ', 'づぉ'],
  ['ぬぁ', 'ぬぃ', 'ぅ', 'ぬぇ', 'ぬぉ'],
  ['ふぁ', 'ふぃ', 'ほぅ', 'ふぇ', 'ふぉ'],
  ['ぶぁ', 'ぶぃ', 'ぅ', 'ぶぇ', 'ぶぉ'],
  ['ぷぁ', 'ぷぃ', 'ぅ', 'ぷぇ', 'ぷぉ'],
  ['むぁ', 'むぃ', 'ぅ', 'むぇ', 'むぉ'],
  ['るぁ', 'るぃ', 'ぅ', 'るぇ', 'るぉ']

]

const hiraganaTokubetsuDan : ObjKey = hiraganaTokubetsuKumi[0].reduce( (acc, value, index) => { return {...acc, [value] : index} }, {} );

const hiraganaKou : ObjKey = hiraganaKumi.reduce( (acc, value, index) => { return {...acc, [value[0]] : index} }, {} );
const hiraganaDan : ObjKey = hiraganaKumi[0].reduce( (acc, value, index) => { return {...acc, [value] : index} }, {} );

const chosungs = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ'
]

const junsungs = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ'
]

const jongsungs = [
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ'
]

const hangulChosungHiraMatch : ObjKey = {
  ㄱ : 'が',
  ㄲ : 'か',
  ㄴ : 'な',
  ㄷ : 'だ',
  ㄸ : 'た',
  ㄹ : 'ら',
  ㅁ : 'ま',
  ㅂ : 'ば',
  ㅃ : 'ぱ',
  ㅅ : 'さ',
  ㅆ : 'さ',
  ㅇ : 'あ',
  ㅈ : 'ざ',
  ㅉ : 'ざ',
  ㅊ : 'た',
  ㅋ : 'か',
  ㅌ : 'た',
  ㅍ : 'ぱ',
  ㅎ : 'は'
}

const hangulJunsungHiraMatch : ObjKey = {
  ㅏ: 'あ',
  ㅐ: 'え',
  ㅑ: 'や',
  ㅒ: 'え',
  ㅓ: 'お',
  ㅔ: 'え',
  ㅕ: 'よ',
  ㅖ: 'え',
  ㅗ: 'お',
  ㅘ: 'ぁ',
  ㅙ: 'ぇ',
  ㅚ: 'ぇ',
  ㅛ: 'よ',
  ㅜ: 'う',
  ㅝ: 'ぉ',
  ㅞ: 'ぇ',
  ㅟ: 'ぃ',
  ㅠ: 'ゆ',
  ㅡ: 'う',
  ㅢ: 'い',
  ㅣ: 'い'
}

const hangulJonsungHiraMatch : ObjKey = {
  ㄱ : 'っ',
  ㄲ : 'っ',
  ㄴ : 'ん',
  ㄷ : 'っ',
  ㄹ : 'っ',
  ㅁ : 'ん',
  ㅂ : 'っ',
  ㅅ : 'っ',
  ㅆ : 'っ',
  ㅇ : 'ん',
  ㅈ : 'っ',
  ㅊ : 'っ',
  ㅋ : 'っ',
  ㅌ : 'っ',
  ㅍ : 'っ',
  ㅎ : 'っ'
}

function useJaText(){
  const unicodeRange = useContext<UnicodeRangeContext>(UnicodeRangeContext);
  const unicodeContext = useContext<UnicodeContext>(UnicodeContext);

  /**
   * Original Code
   * https://github.com/toss/es-hangul/blob/main/src/getChoseong/getChoseong.ts
  */

  const nfd = useMemo( () => [...'각힣'.normalize('NFD')].map( el => el.charCodeAt(0) ), []);
  const chosungsRegex = useMemo( () => new RegExp(
    `[\\u${nfd[0].toString(16)}-\\u${nfd[3].toString(16)}]`,
    'g'
  ), [nfd]);
  const jungsungsRegex = useMemo( () => new RegExp(
    `[\\u${nfd[1].toString(16)}-\\u${nfd[4].toString(16)}]`,
    'g'
  ), [nfd]);
  const jongsungsRegex = useMemo( () => new RegExp(
    `[\\u${nfd[2].toString(16)}-\\u${nfd[5].toString(16)}]`,
    'g'
  ), [nfd]);
  const isHangulRegex = useMemo( () => new RegExp(
    `^[가-힣-]+$`,
    'g'
  ), []);
  const isAllNihongoRegex = useMemo( () => new RegExp(
    `^[${unicodeRange.kanji}${unicodeRange.hiragana}${unicodeRange.katakana}]+$`,
    'g'
  ), [unicodeRange.hiragana, unicodeRange.kanji, unicodeRange.katakana]);
  const isAllHiraRegex = useMemo( () => new RegExp(
    `^[${unicodeRange.hiragana}]+$`
  ), [unicodeRange.hiragana]);
  const isAllKanjiRegex = useMemo( () => new RegExp(
    `^[${unicodeRange.kanji}]+$`
  ), [unicodeRange.kanji]);
  const isHiraRegex = useMemo( () => new RegExp(
    `[${unicodeRange.hiragana}]+`,
    'g'
  ), [unicodeRange.hiragana]);
  const isKanjiRegex = useMemo( () => new RegExp(
    `[${unicodeRange.kanji}]+`,
    'g'
  ), [unicodeRange.kanji])

  const checkChouon = useCallback( ( char : string ) => {
    let normalized = char.normalize('NFD').replace(chosungsRegex, $0 => chosungs[$0.charCodeAt(0) - 0x1100]).replace(jungsungsRegex, $0 => junsungs[$0.charCodeAt(0) - 0x1161]).replace(jongsungsRegex, $0 => jongsungs[$0.charCodeAt(0) - 0x11A8]);
    let second = hangulJunsungHiraMatch[ normalized[1] ];

    switch (second) {
      case 'あ':
        return 'あ';
      case 'い':
        return 'い';
      case 'う':
        return 'う';
      case 'え':
        return 'い'; //e단
      case 'お':
        return 'う'; //o단
      default:
        return 'う';
    }
  }, [chosungsRegex, jongsungsRegex, jungsungsRegex])

  const hangulToHira = useCallback( ( char : string, index : number, arr : Array<string> ) => {
    let normalized = char.normalize('NFD').replace(chosungsRegex, $0 => chosungs[$0.charCodeAt(0) - 0x1100]).replace(jungsungsRegex, $0 => junsungs[$0.charCodeAt(0) - 0x1161]).replace(jongsungsRegex, $0 => jongsungs[$0.charCodeAt(0) - 0x11A8]);

    if(normalized.length >= 2 && normalized.length <= 3){
      let first = hangulChosungHiraMatch[ normalized[0] ];
      let second = hangulJunsungHiraMatch[ normalized[1] ];

      let third = ''
      if(normalized.length === 3){
        third = hangulJonsungHiraMatch[ normalized[2] ];
      }

      /*
      if( de[0] === 'ㅇ' && de[1] === 'ㅘ' ){
        return 'わ' + third;
      }
      */
      if( second === 'ぁ' || second === 'ぃ'|| second === 'ぅ'|| second === 'ぇ'|| second === 'ぉ'){
        let b = hiraganaKou[first];
        let a = hiraganaTokubetsuDan[second];

        return hiraganaTokubetsuKumi[b+1][a] + third;
      }

      let kou = hiraganaKou[first];
      let dan = hiraganaDan[second];

      if(kou === undefined || dan === undefined){
        return char;
      }

      return hiraganaKumi[kou][dan] + third;
    }
    else{
      if( char === '-' && index !== 0){
        return checkChouon( arr[index-1] );
      }
      return char;
    }
  }, [checkChouon, chosungsRegex, jongsungsRegex, jungsungsRegex])

  const koNFCToHira = useCallback( ( hangul : string ) => {
    let hangulArr = hangul.split('');
    let hira = hangulArr.map( (word, index, arr) =>  hangulToHira(word, index, arr) )

    return hira.join('');
  }, [hangulToHira])
  
  const isAllHangul = useCallback( ( text : string ) => {
    isHangulRegex.lastIndex = 0;
    return isHangulRegex.test(text);
  }, [isHangulRegex])

  const isAllNihongo = useCallback( (text : string) => {
    isAllNihongoRegex.lastIndex = 0;
    return isAllNihongoRegex.test(text);
  }, [isAllNihongoRegex])

  const isAllHira = useCallback( (text : string) => {
    isAllHiraRegex.lastIndex = 0;
    return isAllHiraRegex.test(text);
  }, [isAllHiraRegex])

  const extractKanji = useCallback( ( okuri : string ) => {
    let hyouki_kanji = okuri.match(isKanjiRegex);

    return hyouki_kanji;
  }, [isKanjiRegex])

  //okuri : 한자 일본어 섞인 상태, kanji는 한자 only, hira는 히라가나 only
  const getRegexRevise = useCallback( ( text : string ) => {
    let extractKanjiArr = extractKanji(text);
    let kanjiArr : Array<string> = extractKanjiArr !== null ? extractKanjiArr.join('').split('') : [""];
    let kanji_pattern = kanjiArr.map( (arr) => `${arr}`).join(`[${unicodeRange.hiragana}]*`);

    let testRegex = new RegExp(
      `(?<pre>[${unicodeRange.hiragana}]*)(?<pattern>${kanji_pattern})(?<suf>[${unicodeRange.hiragana}]*)`
    )

    return testRegex;
  }, [extractKanji, unicodeRange.hiragana])

  const extractHira = useCallback( ( okuri : string ) => {
    let hyouki_hira = okuri.match(isHiraRegex);

    return hyouki_hira;
  }, [isHiraRegex])

  const checkKatachi = useCallback( ( nihongo : string ) => {
    let isHiraKanjiRegex = new RegExp(
      `^[${unicodeRange.kanji}${unicodeRange.hiragana}${unicodeRange.katakana}]+$`,
      'g'
    );

    isHiraKanjiRegex.lastIndex = 0;
    if( isHiraKanjiRegex.test(nihongo) ){
      isAllHiraRegex.lastIndex = 0;
      isAllKanjiRegex.lastIndex = 0;

      if( isAllHiraRegex.test(nihongo) ){
        return 'hira';
      }
      else if( isAllKanjiRegex.test(nihongo) ){
        return 'kanji';
      }
      else{
        return 'okuri';
      }
    }
    else{
      return null;
    }
  }, [isAllHiraRegex, isAllKanjiRegex, unicodeRange.hiragana, unicodeRange.kanji, unicodeRange.katakana])

  const isOnajiOkuri = useCallback( ( hyouki : string, yomi : string, newText : string ) => {
    let hyouki_type = checkKatachi(hyouki);
    let newText_type = checkKatachi(newText);

    if(hyouki_type === 'kanji'){
      if(newText_type === 'okuri'){
        
        let exKanji = extractKanji(newText);
        let exHira = extractHira(newText);

        let exKanjiPattern = exKanji !== null ? exKanji.map( (arr) => `(${arr}.*)` ).join('') : "";
        let exKanjiRegex = new RegExp(
          `^(.*)${exKanjiPattern}$`
        );
        let exHiraPattern = exHira !== null ? exHira.map( (arr) => `(.*${arr})` ).join('') : "";
        let exHiraRegex = new RegExp(
          `^${exHiraPattern}(.*)$`
        );

        exKanjiRegex.lastIndex = 0;

        if( exKanjiRegex.test(hyouki) ){
          exHiraRegex.lastIndex = 0;

          if( exHiraRegex.test(yomi) ){
            return true;
          }
        }
      }
    }
    else if(hyouki_type === 'okuri'){
      let exKanji = extractKanji(hyouki);
      let exHira = extractHira(hyouki);

      let exKanjiPattern = exKanji !== null ? exKanji.map( (arr) => `(${arr}.*)` ).join('') : null;
      let exKanjiRegex = new RegExp(
        `^(.*)${exKanjiPattern}$`
      );
      let exHiraPattern = exHira !== null ? exHira.map( (arr) => `(.*${arr})` ).join('') : null;
      let exHiraRegex = new RegExp(
        `^${exHiraPattern}(.*)$`
      );

      if(newText_type === 'kanji'){
        // 'お金', 'おかね', '金' 의 경우에는 true가 나옴, newText의 읽기를 비교할수 없는 문제.
        exKanjiRegex.lastIndex = 0;
        if( exKanjiRegex.test(newText) === true ){
          let maeOkuriPattern = exKanji !== null ? exKanji.map( (arr) => `${arr}(?:.*)` ).join('') : "";
          let maeOkuriRegex = new RegExp(
            `^(?<mae>.*)${maeOkuriPattern}$`
          );
          

          if( hyouki.match(maeOkuriRegex)?.groups?.mae === '' ){
            return true;
          }
          else{
            return false;
          }
        }
      }
      else if(newText_type === 'okuri'){
        let extractKanjiArr = extractKanji(newText);
        let exKanjiNew = extractKanjiArr !== null ? extractKanjiArr.join('').split('') : [""];
        
        let exHiraNew = extractHira(newText);

        let exKanjiNewPattern = exKanjiNew !== null ? exKanjiNew.map( (arr) => `(${arr}.*)` ).join('') : "";
        let exKanjiNewRegex = new RegExp(
          `^(.*)${exKanjiNewPattern}$`
        );
        let exHiraNewPattern = exHiraNew !== null ? exHiraNew.map( (arr) => `(.*${arr})` ).join('') : "";
        let exHiraNewRegex = new RegExp(
          `^${exHiraNewPattern}(.*)$`
        );

        exKanjiNewRegex.lastIndex = 0;
        if( exKanjiNewRegex.test(hyouki) ){
          let maeOkuriPattern = exKanjiNew.map( (arr) => `${arr}(?:.*)` ).join('');
          let maeOkuriRegex = new RegExp(
            `^(?<mae>.*)${maeOkuriPattern}$`
          );
          
          exHiraNewRegex.lastIndex = 0;

          if( exHiraNewRegex.test(yomi) ){
            if( hyouki.match(maeOkuriRegex)?.groups?.mae === newText.match(maeOkuriRegex)?.groups?.mae){
              return true;
            }
            else{
              return false;
            }
          }
        }
      }
    }

    return false;
  }, [checkKatachi, extractHira, extractKanji])

  const matchOkuri = useCallback( (hyouki : string, yomi : string, bunText : string) : [string | null, number, number] => {
    let hyouki_type = checkKatachi(hyouki);

    if( hyouki_type === 'kanji' || hyouki_type === 'okuri'){
      let kanji_regex = getRegexRevise(hyouki);

      let match_bun = bunText.match(kanji_regex);
      let match_hyouki = hyouki.match(kanji_regex);

      if( match_bun === null){
        return [null, -1, -1];
      }
      

      let preStr = '';
      let sufStr = ''
      if(match_hyouki?.groups?.pre !== ''){
        let preRegex = new RegExp(
          `${match_hyouki?.groups?.pre}$`,
          'g'
        )
        if(match_bun?.groups?.pre !== ''){
          let preMatch = match_bun?.groups?.pre.match(preRegex);
          if( preMatch !== null && preMatch !== undefined){
            preStr = preMatch[0];
          }
        }
      }
      else{

      }
      if(match_hyouki?.groups?.suf !== '' && match_hyouki?.groups?.suf !== undefined){
        let lastIndex = match_hyouki.groups.suf.length - 1;
        let lastHira = match_hyouki.groups.suf[lastIndex];

        let sufRegex = new RegExp(
          `^[${unicodeRange.hiragana}]*${lastHira}`
        )

        if(match_bun?.groups?.suf !== ''){
          let sufMatch = match_bun?.groups?.suf.match(sufRegex);
          if( sufMatch !== null && sufMatch !== undefined ){

            for(let key in sufMatch){
              let tmp_regex = new RegExp(
                `${sufMatch[key]}$`
              )
              if( yomi.match(tmp_regex) !== null){
                sufStr = sufMatch[key];
              }
            }
          }
        }
      }
      else{
        let lastIndex = yomi.length - 1;
        let lastHira = yomi[lastIndex];

        let sufRegex = new RegExp(
          `^[${unicodeRange.hiragana}]*${lastHira}`
        )

        if(match_bun?.groups?.suf !== ''){
          let sufMatch = match_bun?.groups?.suf.match(sufRegex);
          if( sufMatch !== null && sufMatch !== undefined ){
            
            for(let key in sufMatch){
              let tmp_regex = new RegExp(
                `${sufMatch[key]}$`
              )
              if( yomi.match(tmp_regex) !== null){
                sufStr = sufMatch[key];
              }
            }
          }
        }
      }
      let reviseRegex = new RegExp(
        `${preStr}${match_bun?.groups?.pattern}${sufStr}`,
        'g'
      )
      let match = bunText.match(reviseRegex);

      if(match === null){
        return [null, -1, -1];
      }

      let matchingIndex = bunText.indexOf(match[0]);
      let endIndex = matchingIndex + match[0].length;

      let replaceStr = bunText.split('').fill("　", matchingIndex, endIndex).join('');

      if( isOnajiOkuri(hyouki, yomi, match[0]) === true){
        return [replaceStr, matchingIndex, endIndex];
      }
      if( hyouki === match[0] ){
        return [replaceStr, matchingIndex, endIndex];
      }
    }

    return [null, -1, -1];
  }, [checkKatachi, getRegexRevise, isOnajiOkuri, unicodeRange.hiragana])

  const matchOkuriExec = useCallback( (hyouki : string, yomi : string, bunText : string) => {
    let text : string = bunText;

    function matchExec(){
      let ret = matchOkuri(hyouki, yomi, text);
      if(ret[0] !== null){
        text = ret[0];
        return ret;
      }
      else{
        return null;
      }
    }

    return {
      exec(){
        return matchExec();
      }
    }
  }, [matchOkuri])

  const matchAllOkuri = ( hyouki : string, yomi : string, bunText : string ) => {
    let match = matchOkuriExec(hyouki, yomi, bunText);

    let arr;
    while( (arr = match.exec()) !== null ){
      // 사용되지 않는 것으로 보임.
    }
  }

  const getMED = (bunText : string, newText : string) => {
    let medArr = Array.from( Array(bunText.length+1), () => new Array(newText.length+1));

    for(let i = 0; i < medArr.length; i++){
      for(let j = 0; j < medArr[i].length; j++){
        if(i === 0){
          medArr[i][j] = j;
        }
        else{
          if(j === 0){
            medArr[i][j] = i;
          }
          else{
            if( bunText[i-1] === newText[j-1]){
              medArr[i][j] = medArr[i-1][j-1];
            }
            else{
              medArr[i][j] = Math.min( medArr[i][j-1], medArr[i-1][j], medArr[i-1][j-1] ) + 1;
            }
          }
        }
      }
    }

    let ret = {
      del : new Array(),
      add : new Array()
    }

    let retRevise : tracedMed = {
      del : new Array(bunText.length).fill(0),
      add : new Array(newText.length).fill(0)
    }

    let i = medArr.length-1;
    let j = medArr[0].length-1;
    while( !(i === 0 && j === 0) ){
      if( i === 0){

        ret.add.push({
          text : newText[j-1], offset : j-1
        });
        retRevise.add[j-1] = 1;
        j -= 1;

        continue;
      }
      if( j === 0){

        ret.del.push({
          text : bunText[i-1], offset : i-1
        });
        retRevise.del[i-1] = 1;
        i -= 1;

        continue;
      }

      let min = Math.min( medArr[i][j-1], medArr[i-1][j], medArr[i-1][j-1] );

      if(medArr[i][j] === min){
        i -= 1;
        j -= 1;
      }
      else{
        if( min === medArr[i][j-1]){
          
          ret.add.push({
            text : newText[j-1], offset : j-1
          });
          retRevise.add[j-1] = 1;
          j -= 1;
        }
        else if( min === medArr[i-1][j]){
          
          ret.del.push({
            text : bunText[i-1], offset : i-1
          });
          retRevise.del[i-1] = 1;
          i -= 1;
        }
        else{

          ret.del.push({
            text : bunText[i-1], offset : i-1
          });
          ret.add.push({
            text : newText[j-1], offset : j-1
          });
          retRevise.del[i-1] = 1;
          retRevise.add[j-1] = 1;
          i -= 1;
          j -= 1;
        }
      }
    }

    let delExec = function( delMed : Array<number> ){
      let medValue = delMed;

      function getValue(){
        return medValue;
      }

      function getIsDel(start : number, end : number){
        return medValue.reduce( (acc, v, i) => {
          if( start <= i && i < end ){
            return acc + v;
          }
          return acc;
        }, 0);
      }

      function setDel(start : number, end : number){
        medValue = medValue.map( (arr, i) => {
          if( start <= i && i < end ){
            return 1;
          }
          else{
            return arr;
          }
        });
      }

      return{
        getIsDel(start : number, end : number){
          return getIsDel(start, end);
        },
        setDel(start : number, end : number){
          return setDel(start, end);
        },
        getValue(){
          return getValue();
        }
      }
    }

    let addExec = function( addMed : Array<number> ){
      let medValue = addMed;

      function getValue(){
        return medValue;
      }

      function getIsAdd(start : number, end : number){
        return medValue.reduce( (acc, v, i) => {
          if( start <= i && i < end ){
            return acc + v;
          }
          return acc;
        }, 0);
      }

      function setAdd(start : number, end : number){
        medValue = medValue.map( (arr, i) => {
          if( start <= i && i < end ){
            return 1;
          }
          else{
            return arr;
          }
        });
      }

      return{
        getIsAdd(start : number, end : number){
          return getIsAdd(start, end);
        },
        setAdd(start : number, end : number){
          return setAdd(start, end);
        },
        getValue(){
          return getValue();
        }
      }
    }

    return { del : delExec(retRevise.del), add : addExec(retRevise.add) };
  }

  const traceHukumu = useCallback( (hukumu : Array<HukumuData>, bunText : string, newText : string) => {
    const med = getMED(bunText, newText);

    //일단 현재 getHukumuData의 양식에 따라서.
    const matchArr = hukumu.map( (arr) => { return matchOkuriExec(arr.hyouki, arr.yomi, newText) });

    let ret = [...hukumu] as Array<tracedHukumu>;

    let { del, add } = med;

    for( let i in hukumu){
      let { startOffset : start, endOffset : end } = hukumu[i];

      let isDel = del.getIsDel(start, end);

      if( isDel === 0 ){
        //아무것도 삭제되지 않은 경우.
        let tmpArr;
        while( (tmpArr = matchArr[i].exec()) !== null){
          let [ , newStart, newEnd ] = tmpArr;
          let isAdd = add.getIsAdd( newStart, newEnd );

          if( isAdd < newEnd - newStart ){
            del.setDel(start, end);
            add.setAdd(newStart, newEnd);

            ret[i].find = { str : newText.substring(newStart, newEnd), startOffset : newStart, endOffset : newEnd }
            break;
          }
        }
        if( tmpArr === null ){
          ret[i].find = null;
        }
      }
      else if( isDel < end - start){
        //일부 삭제된 경우.
        let tmpArr;
        while( (tmpArr = matchArr[i].exec()) !== null){
          let [ , newStart, newEnd ] = tmpArr;
          let isAdd = add.getIsAdd( newStart, newEnd );

          if(isAdd < newEnd - newStart){
            del.setDel(start, end);
            add.setAdd(newStart, newEnd);

            ret[i].find = { str : newText.substring(newStart, newEnd), startOffset : newStart, endOffset : newEnd };
            break;
          }
        }
        if( tmpArr === null ){
          ret[i].find = null;
        }
      }
      else{
        let tmpArr;
        while( (tmpArr = matchArr[i].exec()) !== null){
          let [ , newStart, newEnd ] = tmpArr;
          let isAdd = add.getIsAdd( newStart, newEnd );

          if(isAdd === newEnd - newStart){
            add.setAdd(newStart, newEnd);

            ret[i].find = { str : newText.substring(newStart, newEnd), startOffset : newStart, endOffset : newEnd };
            break;
          }
        }
        if( tmpArr === null ){
          ret[i].find = null;
        }
      }
    }

    ret = ret.map( (v) => {
      if(v.find !== null){
        if(v.startOffset === v.find.startOffset && v.endOffset === v.find.endOffset && v.hyouki === v.find.str){
          return { ...v, tag : 'searched'}
        }
        else{
          return { ...v, tag : 'modified'}
        }
      }
      else{
        return { ...v, tag : 'deleted'}
      }
    })

    return { trace : ret, del : del, add : add };
  }, [matchOkuriExec])

  const isBun = (bunText : string) => {
    let ret = false;

    let indexKagiDepth = 0;

    let length = bunText.length;
    let index = 0;
    while(index < length){
      if(bunText.charAt(index) === '\n'){
        break;
      }
      else if(bunText.charAt(index) === '。'){
        break;
      }
      else if(bunText.charAt(index) === '「'){
        indexKagiDepth++;
      }
      else if(bunText.charAt(index) === '」'){
        indexKagiDepth--;
      }
    }

    if( index !== length-1 ){
      ret = false;
    }
    else{
      if(indexKagiDepth === 0){
        ret = true;
      }
      else{
        ret = false;
      }
    }

    return ret;
  }

  const replaceSpecial = (bunText : string) => {
    let repBun = bunText.replaceAll('\'', '\'\'');

    return repBun;
  }

  const autoPeriod = (bunText : string) => {
    let isPeriodRegex = new RegExp(
      `^.+。$`
    );
    let isKagiRegex = new RegExp(
      `^.+[」|』]$`
    );
    //일단 예상치 못한 곳에도 들어가는 문제가 있음.

    if(isPeriodRegex.test(bunText) === false){
      if(isKagiRegex.test(bunText) === false){
        bunText = bunText.concat('。');
      }
    }
    return bunText;
  }

  const getHyoukiQuery = (multiInputData : MultiInput[]) : string => {
    return multiInputData.map( (v) => v.data ).join('_');
  }

  const getYomiQuery = ( multiInputData : MultiInput[], multiValue : string[] ) : string => {
    return multiInputData.map( (v, i) => v.inputBool === false ? '0' : multiValue[i] ).join('_');
  }
  
  const convertObjKey = ( arr : any ) => {
    let obj : ObjKey = {};
    for( let key in arr ){
      obj[key] = arr[key];
    }

    return obj;
  }

  return { 
    koNFCToHira, 
    isAllHangul, isAllNihongo, isAllHira, checkKatachi, isOnajiOkuri, 
    matchOkuri, matchOkuriExec, matchAllOkuri, traceHukumu, 
    isBun, 
    replaceSpecial, autoPeriod,
    getHyoukiQuery, getYomiQuery, convertObjKey
  }
}

export { useJaText }