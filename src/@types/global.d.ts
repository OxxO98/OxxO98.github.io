export {};

declare global {

  export interface UnicodeContext {
    kanji : RegExp;
    kanjiStart : RegExp;
    kanjiEnd : RegExp;
    hiragana : RegExp;
    okuri : RegExp;
  }

  export interface UnicodeRangeContext {
    kanji : string;
    hiragana : string;
    katakana : string;
  }

  export interface VideoContext {
    videoId : string;
    frameRate : number;
  }

  export interface AudioDataContext {
    audioData : AudioBuffer | null;
    audioLoaded : boolean;
    audioError : boolean;
  }

  //일단 대체할 방법이 없어 보이는 부분, 레거시를 제외하고 제한적으로 사용바람
  export interface ObjStringKey<T> extends Array<T> {
    [index : string | number] : T;
  }

  type ObjKey = {
    [index : string | number] : any;
  }

  //type
  export type lang = 'ja' | 'en' | 'ko';

  export type BId = string;
  export type ytBId = string;
  export type jaBId = string;
  export type koBId = string;
  export type tId = string;
  export type hyId = string;
  export type iId = string;
  export type kId = string;


  //DB Object
  export interface YTBun {
    ytBId : ytBId;
    jaBId : jaBId;
    koBId : koBId;
    koText : string;
    jaText : string;
  }

  export interface jaBun {
    jaBId : jaBId;
    jaText : string;
    ytBId : ytBId;
  }

  export interface koBun {
    koBId : koBId;
    koText : string;
    ytBId : ytBId;
  }

  export interface Translate {
    jaBId : jaBId;
    koBId : koBId;
    koText : string;
  }

  //Data
  export interface HukumuData {
    tId : tId;
    hyId : hyId;
    hyouki : string;
    yomi : string;
    startOffset : number;
    endOffset : number;
  }

    //LIstComps
  export interface HukumuList {
    jaBId : jaBId;
    jaText : string;
    startOffset : number;
    endOffset : number;
  } //애매함문제 RESPONSE인가??

  export interface TangoList {
    tId : tId;
    hyouki : string;
    yomi : string;
  } //애매함 문제 RESPONSE인가??

  export interface OsusumeList {
    tId : tId;
    hyId : hyId;
    hyouki : string;
    yomi : string;
  } //애매함 문제 RESPONSE인가??

  export interface FilteredData {
    right : Array<number>; 
    left : Array<number>;
    length : number;
  }

  export type AudioData = FilteredData;

  export interface TextData {
    data : string;
    ruby : string | null;
    offset : number;
  }

  export interface imiData {
    iId : string;
    koText : string;
  }

  export interface ComplexText {
    hyouki : string;
    yomi : string;
  }

  export interface TangoData {
    list : Array<ComplexText>;
    imi : Array<string> | null;
  }

    //Tangochou
  export interface TangochouData {
    tId : tId;
    hyId : string;
    textData : Array<TextData>;
    yomi : string;
    hyouki : string;
  }

  export interface KanjiData {
    kId : kId;
    jaText : string;
  }

  export interface TangoBunListData {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    hyId : string;
    iId : string;
    tId : string;
    textData : Array<TextData>
    hyouki : string;
    yomi : string;
  }

  export interface TangoBunData {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    hyId : string;
    iId : string;
    tId : string;
    jaText : string;
    ytBId : string;
  }

  export interface KanjiTangoData {
    tId : tId;
    hyouki : string;
    yomi : string;
    kId : kId;
    jaText : string;
  }

  //others Data
  export interface MultiInput {
    data : string;
    inputBool : boolean;
  }

  export interface SearchText {
    hyouki : string;
    yomi : string;
  }

  export interface TangoDBSearchedList {
    kanzen : Array<RES_SEARCH_TANGO>;
    orSame : Array<RES_SEARCH_TANGO>;
    prefix : Array<RES_SEARCH_TANGO>; 
    suffix : Array<RES_SEARCH_TANGO>;
    okuri : Array<RES_SEARCH_TANGO>;
    theOther : Array<RES_SEARCH_TANGO>;
  }

  //Response@axios
  export interface ApiResponse<T> {
    data : T;
    message? : 'empty' | 'success' | 'error' | 'done';
  }

  export type RES_GET_TRANSCRIPT = string;
  export type REQ_GET_TRANSCRIPT = {
    videoId : string;
    reset? : 'true' | 'false';
    lang? : lang;
    offset? : OffsetObj;
  }

  export type RES_GET_TRANSCRIPT_RANGE = string;
  export type REQ_GET_TRANSCRIPT_RANGE = {
    videoId : string;
    startOffset : number;
    endOffset : number;
    reset? : 'true' | 'false';
    lang? : lang;
    offset? : OffsetObj;
  }

  export type RES_GET_VIDEO = RES_VIDEO[];
  export type REQ_GET_VIDEO = null;

  export type RES_GET_TIMELINE = RES_TIMELINE[];
  export type REQ_GET_TIMELINE = {
    videoId : string;
  }

  export type RES_GET_SHARE = RES_SHARE[];
  export type REQ_GET_SHARE = {
    videoId : string;
  }

  export type RES_GET_JSON = RES_JSON[];
  export type REQ_GET_JSON = {
    videoId : string;
  }

  export type RES_GET_CAPTION = RES_CAPTION[];
  export type REQ_GET_CAPTION = {
    videoId : string;
  }

  export type RES_GET_BUN = {
    jaText : string;
    hukumuArr : RES_HUKUMU_DATA[];
  }
  export type REQ_GET_BUN = {
    bId : string;
  }

  export type RES_GET_HUKUMU = RES_HUKUMU_DATA[];
  export type REQ_GET_HUKUMU = {
    jaBId : string;
  }

  export type RES_GET_HUKUMU_CHECK = RES_HUKUMU_CHECK[];
  export type REQ_GET_HUKUMU_CHECK = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
  }

  export type RES_GET_IMI = RES_IMI;
  export type REQ_GET_IMI = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
  }

  export type RES_GET_INTEGRITY = null;
  export type REQ_GET_INTEGRITY = null;

  export type RES_GET_LIST_HUKUMU = HukumuList[];
  export type REQ_GET_LIST_HUKUMU = {
    videoId : string;
    jaBId : string;
    startOffset : number;
    endOffset : number;
    hyouki : string;
  }

  export type RES_GET_LIST_OSUSUME = OsusumeList[];
  export type REQ_GET_LIST_OSUSUME = {
    hyouki : string;
  }

  export type RES_GET_LIST_TANGO = TangoList[];
  export type REQ_GET_LIST_TANGO = {
    videoId : string;
  }
  
  export type RES_GET_TANGO = TangoData;
  export type REQ_GET_TANGO = {
    tId : string;
  }

  export type RES_GET_TANGO_CHECK = RES_SEARCH_TANGO[];
  export type REQ_GET_TANGO_CHECK = {
    hyouki : string;
    yomi : string;
  }

  export type RES_GET_TANGOCHOU = RES_TANGOCHOU_LIST;
  export type REQ_GET_TANGOCHOU = {
    videoId : string;
  }

  export type RES_GET_TANGOCHOU_TANGO_INFO = {
    tangoList : TangoBunListData[];
    kanjiList : KanjiData[];
  }
  export type REQ_GET_TANGOCHOU_TANGO_INFO = {
    videoId : string;
    tId : string;
  }

  export type RES_GET_TANGOCHOU_TANGO_LIST = TangoBunData[];
  export type REQ_GET_TANGOCHOU_TANGO_LIST = {
    videoId : string;
    hyId : string;
  }

  export type RES_GET_TANGOCHOU_KANJI_INFO = {
    kanji : KanjiData;
    tangoList : KanjiTangoData[];
  }
  export type REQ_GET_TANGOCHOU_KANJI_INFO = {
    videoId : string;
    kId : string;
  }

  export type RES_GET_TANGOCHOU_SEARCH = RES_TANGOCHOU_LIST;
  export type REQ_GET_TANGOCHOU_SEARCH = {
    videoId : string;
    keyword : string;
  }

  export type RES_GET_TANGOCHOU_PDF = RES_PDF_ALL;
  export type REQ_GET_TANGOCHOU_PDF = {
    videoId : string;
  }

  export type RES_GET_TRANSLATE = {
    jaBun : jaBun;
    koBun : koBun | null;
    jaList : Array<jaBun>;
    koList : Array<koBun> | null;
  }
  export type REQ_GET_TRANSLATE = {
    videoId : string;
    ytBId : string;
  }

  export type RES_GET_TRANSLATE_REP = YTBun;
  export type REQ_GET_TRANSLATE_REP = {
    videoId : string;
    ytBId : string;
  }

  //REQUEST : POST, PUT, DELETE
  export type REQ_POST_TRANSLATE = {
    videoId : string;
    ytBId : string;
    value : string;
  }
  export type REQ_PUT_TRANSLATE = {
    videoId : string;
    ytBId : string;
    value : string;
  }
  export type REQ_DELETE_TRANSLATE = {
    videoId : string;
    ytBId : string;
    koBId : string;
  }

  export type REQ_PUT_TRANSLATE_REP = {
    videoId : string;
    ytBId : string;
    koBId : string;
  }
  
  export type REQ_POST_LIST_COMMIT = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    tId : string;
    hyId : string;
  }

  export type REQ_POST_IMI = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    tId : string;
    value : string;
  }
  export type REQ_PUT_IMI = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    iId : string;
  }
  export type REQ_DELETE_IMI = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    iId : string;
  }

  export type REQ_POST_HUKUMU = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    hyoukiStr : string;
    yomiStr : string;
    hyouki : string;
    yomi : string;
    tId? : string;
  }
  export type REQ_PUT_HUKUMU = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    hyId : string;
    hyoukiStr : string;
    yomiStr : string;
    hyouki : string;
    yomi : string;
  }
  export type REQ_DELETE_HUKUMU = {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    hyId : string;
  }

  export type REQ_PUT_HUKUMU_BUN = {
    jaBId : string;
    jaText : string;
    modifiedObj : ObjKey;
    deletedObj : ObjKey;
  }
  export type REQ_DELETE_HUKUMU_BUN = {
    videoId : string;
    ytBId : string;
    jaBId : string;
  }

  export type REQ_POST_BUN = {
    videoId : string;
    jaText : string;
    startTime : number;
    endTime : number;
  }
  export type REQ_PUT_BUN_TIME = {
    videoId : string;
    ytBId : string;
    startTime : number;
    endTime : number;
  }
  export type REQ_PUT_BUN_JATEXT = {
    videoId : string;
    ytBId : string;
    jaText : string;
  }

  export type REQ_PUT_BUNKATSU = {
    videoId : string;
    ytBId : string;
    critTime : number;
    critJaText : number; //분할 위치 오프셋
    critKoText : number; //분할 위치 오프셋
  }
  export type REQ_PUT_HEIGOU = {
    videoId : string;
    ytBId : string;
    nextYtBId : string;
  }

  export type REQ_POST_VIDEO = {
    youtubeSrc : string;
    title : string;
  }

  export type REQ_POST_TRANSCRIPT_TO_BUNS = {
    videoId : string;
  }

  export type REQ_POST_CAPTION_TO_BUNS = {
    videoId : string;
  }

  //Response legacy
  export interface RES_HUKUMU_DATA {
    jaBId : string;
    startOffset : number;
    endOffset : number;
    hyId : string; //yomi와 통합
    iId : string | null;
    tId : string;
    //Hyouki
    textData : Array<TextData>;
    yomi : string;
    hyouki : string;
  }

  export interface RES_VIDEO {
    title : string;
    src : string;
  }

  export interface RES_TIMELINE {
    ytBId : ytBId;
    jaBId : jaBId;
    koBId? : koBId | null;
    startTime : number;
    endTime : number;
    jaText : string;
    koText? : string;
  }

  export interface RES_HUKUMU_CHECK {
    tId : tId;
    hyId : hyId;
    hyouki : string;
    yomi : string;
    startOffset : number;
    endOffset : number;
    textData : Array<TextData>
  }

  export interface RES_IMI {
    iId : string;
    imi : string | null;
    iIds : imiData[]
  }

  export interface RES_SEARCH_TANGO {
    hyouki : string;
    yomi : string;
    tId : tId;
    hyId : hyId;
    hyOffset : number;
    yOffset : number;
  }

  export type RES_TANGOCHOU_LIST = TangochouData[]

  export interface RES_TANGO_INFO {
    tangoList : Array<TangoBunData>;
    kanjiList : Array<KanjiData>;
  }

  export interface RES_KANJI_INFO {
    kanji : KanjiData;
    tangoList : Array<KanjiTangoData>
  }

    //PDF
  export interface RES_PDF_TANGO_DATA {
    //HUKUMU
    jaBId : jaBId;
    startOffset : number;
    endOffset : number;
    hyId : hyId;
    iId : iId | null;
    tId : string;
    //HYOUKI
    textData : Array<TextData>;
    yomi : string;
    hyouki : string;
    //JABUN
    jaText : string;
    //IMI
    imi : string;
    //KOBUN
    koText : string;
  }

  export interface RES_PDF_KANJI_DATA {
    //HUKUMU
    hyId : hyId;
    tId : tId;
    //HYOUKI
    textData : Array<TextData>;
    yomi : string;
    hyouki : string;
    //IMI
    imi : string;
    //KANJI
    kId : kId;
    jaText : string; //한자 표기
  }

  export type RES_PDF_TANGO_LIST = Array<RES_PDF_TANGO_DATA>;

  export type RES_PDF_KANJI_LIST = Array<RES_PDF_KANJI_DATA>;

  export interface RES_PDF_ALL {
    tangoList : Array<RES_PDF_TANGO_LIST>;
    kanjiList : Array<RES_PDF_KANJI_LIST>;
  };

  //공유하는 데이터
  export interface RES_SHARE {
    startTime : number;
    endTime : number;
    jaText : string;
    textData : Array<RES_SHARED_TEXTDATA>;
    koText? : string;
  }

  export interface RES_SHARED_TEXTDATA {
    d : string; //data
    r : string | null; //ruby
    o : number; //offset
  }

  export interface RES_SHARED_TIMELINE {
    s : number; //startTime
    e : number; //endTime
    j : Array<RES_SHARED_TEXTDATA>; //jaText but, Textdata
    k : string; //koText
  }

  export interface RES_SHARED_DATA {
    v : string; //videoId
    t : RES_SHARED_TIMELINE[]; //timeline
  }

  export interface RES_JSON {
    startTime : number;
    endTime : number;
    jaText : string;
    textData : Array<TextData>;
    koText? : string;
  }

  export interface JSON_DATA {
    startTime : number;
    endTime : number;
    hurigana : string;
    jaText : string;
    koText : string;
  }

  //Bun
  export interface StyledObj {
    bId : string;
    startOffset : number;
    endOffset : number;
    opt : string;
  }

  export interface RefetchObj {
    fetchBun : () => void;
    fetchHukumu : () => void;
    fetchTL : () => void;
  }
  
  export interface OffsetObj {
    startOffset : number;
    endOffset : number;
  }

  export type BIdRef = ObjStringKey<RefetchObj | any>

  export interface RefetchHandles {
    bId? : ( bId : string, ...props : any[] ) => void;
    reset? : () => void;
    refetch : ( bId : string, ...props : any[] ) => void;
    refetchAll : () => void;
    resetList : () => void;
  }

  //ReactPlayer
  export interface ReactPlayerState {
    src : string;
    pip : boolean;
    playing : boolean;
    controls : boolean;
    volume : number;
    muted : boolean;
    played : number;
    playedSeconds : number;
    loaded : number;
    duration : number;
    loop : boolean;
    seeking : boolean;
  }

  export interface PlayerHandles {
    handlePausePlay : ( playing : boolean ) => void;
    handlePlay : () => void;
    handlePause : () => void;
    handleTimeUpdate : () => void; 
    handleDurationChange : () => void;
    handleSeek : ( time : number ) => void;
  }
  
  export interface AutoStop {
    set : boolean;
    startOffset : number;
    endOffset : number;
    loop : boolean;
  }

  
  export interface HandleKeyboardObj {
    pauseYT? : () => void;
    prevSec? : () => void;
    nextSec? : () => void;
    prevFrame? : () => void;
    nextFrame? : () => void;
    gotoTime? : (time : number, playBool : boolean | null) => void;
    markStart? : () => void;
    markEnd? : () => void;
    selectStartTime? : () => void;
    selectEndTime? : () => void;
    markerPlay? : () => void;
    markerStop? : () => void;
    loop? : () => void;
    nextMarkerPlay? : () => void;
    custom? : Array<{ key : string; action : () => void; }>
  }

  export interface VideoPlayerHandles {
    gotoTime : ( time : number, playBool : boolean | null ) => void;
    setScratch : ( set : boolean, startOffset : number, endOffset : number, loop : boolean ) => void;
    keyboard : HandleKeyboardObj;
    autoStop : AutoStop;
  }

  //i18n
  export interface Locale {
    LayoutComp : LayoutComp;
    LayoutCompYoutube: LayoutCompYoutube;

    SharedModalComp : SharedModalComp;
    NewVideoComp : NewVideoComp;

    TimelineComp : TimelineComp;
    TimelineBun : TimelineBun;

    UpdateBunJaTextModalComp : UpdateBunJaTextModalComp;
    DeleteBunModalComp : DeleteBunModalComp;
    BunkatsuTimelineComp : BunkatsuTimelineComp;
    HeigouTimelineComp : HeigouTimelineComp;

    MakeDrftComp : MakeDrftComp;

    AudioWaveComp : AudioWaveComp;
    HelpModal : HelpModal;

    DictionaryComp : DictionaryComp;

    HonyakuController : HonyakuController;
    HonyakuRepresentive : HonyakuRepresentive;

    HukumuBunComp : HukumuBunComp;

    TangoComp : TangoComp;
    DynamicInputComp : DynamicInputComp;
    ModalTangoDB : ModalTangoDB;
    AccordianTangoDB : AccordianTangoDB;
    TangoDB : TangoDB;

    ModalUpdateHukumu : ModalUpdateHukumu;
    ModalDeleteHukumu : ModalDeleteHukumu;

    ImiComp : ImiComp;

    Osusume : Osusume;

    Tango : Tango;

    TangochouRepresentive : TangochouRepresentive;
    TangoInfo : TangoInfo;
    KanjiInfo : KanjiInfo;
    PdfModalComp : PdfModalComp;

    TimelineCarouselComp : TimelineCarouselComp;
    TimelineCarouselHonyakuComp : TimelineCarouselHonyakuComp;

    AiComp : AiComp;

    NotFoundPage : NotFoundPage;

    SharedPage : SharedPage;
    SharedTimelineCarouselComp : SharedTimelineCarouselComp;
    SharedBunSettingModalComp : SharedBunSettingModalComp;
    SharedDictionaryComp : SharedDictionaryComp;
  }

  export interface LayoutComp {
    HOME : string;
  }

  export interface LayoutCompYoutube extends LayoutComp {
    VIDEO : string;
    MARKING : string;
    TIMELINE : string;
    HONYAKU : string;
    TANGOCHOU : string;
  }

  export interface SharedModalComp {
    TITLE : string;
    MESSAGE : {
      SUCCESS : string;
      ERROR : string;
    }
    BUTTON : {
      TITLE : string;
      CANCLE : string;
      COPY : string;
      SAVE : string;
      SAVE_CAPTION_JA : string;
      SAVE_CAPTION_KO : string;
    }
  }

  export interface NewVideoComp {
    TITLE : string;
    STEPS : string[];
    BUTTON : {
      TITLE : string;
      NEXT : string;
      PREV : string;
      DONE : string;
    }
    LABEL : string[];
  }

  export interface TimelineComp {
    BUTTON : {
        PART_TRANSCRIPT : string;
        SAVE_NEW : string;
        CANCLE : string;
        MODIFY_TIME : string;
    }
  }

  export interface TimelineBun {
    BUTTON : {
      MODIFY : string;
      MOVE : string;
    }
  }

  export interface UpdateBunJaTextModalComp {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      CANCLE : string;
      DONE : string;
    }
    CONTENTS : string[];
  }

  export interface DeleteBunModalComp {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      CANCLE : string;
      DONE : string;
    },
    CONTENTS : string[];
  }
  
  export interface BunkatsuTimelineComp {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      CANCLE : string;
      DONE : string;
    },
    CONTENTS : string[];
  }

  export interface HeigouTimelineComp {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      CANCLE : string;
      DONE : string;
    },
    CONTENTS : string[];
  }

  export interface MakeDrftComp {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      RE_TRANSCRIPT : string;
      DONE_TRANSCRIPT : string;
      DONE_CAPTION : string;
      CANCLE : string;
    },
    CONTENTS : string[];
  }

  export interface AudioWaveComp {
    BUTTON : {
      PLAYING : string;
      SCRATCH : string;
      ZOOM_IN : string;
      ZOOM_OUT : string;
    }
  }

  export interface HelpModal {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      CANCLE : string;
    }
    CONTENTS : { TITLE : string; ITEMS : string[] }[];
  }

  export interface DictionaryComp {
    MESSAGE : {
      ERROR : string;
    }
  }

  export interface HonyakuController {
    BUTTON : {
        DELETE : string;
        SAVE_NEW : string;
        MODIFY : string;
        CANCLE : string;
    }
  }

  export interface HonyakuRepresentive {
    BUTTON : {
      MODIFY : string;
    },
    MESSAGE : {
      EMPTY : string;
    }
  }

  export interface HukumuBunComp {
    BUTTON : {
      TITLE : string;
    }
  }

  export interface TangoComp {
    CONTENTS : {
      YOMI : string;
      TANGO : string;
    }
    BUTTON : {
      CANCLE : string;
      MODIFY : string;
    }
  }

  export interface DynamicInputComp {
    CONTENTS : {
      YOMI : string;
      TANGO : string;
    }
  
  }

  export interface ModalTangoDB {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      SAVE_NEW : string;
      CANCLE : string;
    }
  }

  export interface AccordianTangoDB {
    CONTENTS : {
      SEARCHED_LIST : string[];
      MESSAGE : string;
    }
  }

  export interface TangoDB {
    CONTENTS : {
      EMPTY : string;
    }
    BUTTON : {
      DONE : string;
    }
  }

  export interface ModalUpdateHukumu {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      MODIFY : string;
      CANCLE : string;
    }
    MESSAGE : string[][];
  }

  export interface ModalDeleteHukumu {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      DELETE : string;
      CANCLE : string;
    }
  }

  export interface ImiComp {
    CONTENTS : {
      TANGO : string;
      IMI : string;
    }
    BUTTON : {
      DONE : string;
      DELETE : string;
    }
  }

  export interface Osusume {
    BUTTON : {
      TITLE : string;
    }
  }

  export interface PdfModalComp {
    TITLE : string;
    BUTTON : {
      TITLE : string;
      REVIEW : string;
      SAVE : string;
    },
    SELECT : {
      TANGO_ONLY : string;
      KANJI_ONLY : string;
      BOTH : string;
    }
  }

  export interface Tango {
    BUTTON : {
      MOVE : string;
    }
  }

  export interface TangochouRepresentive {
    BUTTON : {
      MOVE : string;
    }
  }

  export interface TangoInfo {
    BUTTON : {
      BACK : string;
      CLOSE : string;
    }
  }

  export interface KanjiInfo {
    BUTTON : {
      MOVE : string;
      BACK : string;
      CLOSE : string;
    }
  }

  export interface TimelineCarouselComp {
    BUTTON : {
      PREV : string;
      CURR : string;
      NEXT : string;
      MODIFY : string;
      CANCLE : string;
    }
  }

  export interface TimelineCarouselHonyakuComp {
    BUTTON : {
      PREV : string;
      CURR : string;
      NEXT : string;
    }
  }

  export interface AiComp {
    BUTTON : {
      NEW_CHAT : string;
      DONE : string;
      CANCLE : string;
    }
  }

  //NOT_FOUND
  export interface NotFoundPage {
    MESSAGE : {
      ERROR : string;
    }
    BUTTON : {
      MOVE : string;
    }
  }

  //SHARED
  export interface SharedPage {
    BUTTON : {
      SAVE_CAPTION_JA : string;
      SAVE_CAPTION_KO : string;
    }
  }

  export interface SharedTimelineCarouselComp {
    BUTTON : {
      PREV : string;
      CURR : string;
      NEXT : string;
    }
    SELECT : {
      JATEXT_ONLY : string;
      KOTEXT_ONLY : string;
      BOTH : string;
    }
  }

  export interface SharedBunSettingModalComp {
    TITLE : string;
    BUTTON : {
      CANCLE : string;
      DONE : string;
    }
    CONTENTS : string[];
  }

  export interface SharedDictionaryComp {
    MESSAGE : {
      ERROR : string;
    }
  }
  
  //Etc...
  //jaText Hook
  export interface tracedHukumu extends HukumuData {
    find : { str : string, startOffset : number, endOffset : number } | null;
    tag : 'searched' | 'modified' | 'deleted';
  }

  export interface tracedMed {
    add : Array<number>;
    del : Array<number>;
  }
}