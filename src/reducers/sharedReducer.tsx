import { createSlice } from '@reduxjs/toolkit'

//SharedPage 공유 페이지 통합
type fonts = { value : string, label : string, weight : string | number }[];

interface SharedInitial {
    backgroundColor : string;
    jaTextColor : string;
    koTextColor : string;
    
    jaTextFontSize : number;
    jaFontWeight : number | string;
    koTextFontSize : number;
    koFontWeight : number | string;

    jaFontFamily : string;
    koFontFamily : string;

    sortFont : boolean;
    fontShadow : boolean;

    jaFonts : fonts;
    koFonts : fonts;
}

const koFonts : fonts = [
    { value : "Aggravo", label : "Aggravo", weight : 700 },
    { value : "nanumsquare", label : "nanumsquare", weight : 900 },
    { value : "nanumgothic", label : "nanumgothic", weight : 700 },
    { value : "OneStoreMobilePop", label : "OneStoreMobilePop", weight : 'normal' },
    { value : "RoundedFixedsys", label : "RoundedFixedsys", weight : 'normal' },
    { value : "KyoboHandwriting2019", label : "KyoboHandwriting2019", weight : 'normal' },
    { value : "InkLiquid", label : "InkLiquid", weight : 'normal' },
    { value : "DnfBitbeatV2", label : "DnfBitbeatV2", weight : 400 },
    { value : "OngleipWFontList", label : "OngleipWFontList", weight : 'normal' },
]

const jaFonts : fonts = [
    { value : "Noto Sans JP", label : "Noto Sans JP", weight : 800 },
    { value : "Mochiy Pop One", label : "Mochiy Pop One", weight : 400 },
    { value : "Dela Gothic One", label : "Dela Gothic One", weight : 400 },
    { value : "Sawarabi Gothic", label : "Sawarabi Gothic", weight : 400 },
    { value : "BIZ UDPGothic", label :  "BIZ UDPGothic", weight : 400 },
    { value : "Rampart One", label : "Rampart One", weight : 400 },
    { value : "DotGothic16", label : "DotGothic16", weight : 400 },
    { value : "Zen Kurenaido", label : "Zen Kurenaido", weight : 400 }
]

const initialState : SharedInitial = {
    backgroundColor : '#00000050',
    jaTextColor : '#ffe600',
    koTextColor : '#FFFFFF',

    jaTextFontSize : 24,
    koTextFontSize : 36,

    jaFontFamily : jaFonts[0].value,
    jaFontWeight : jaFonts[0].weight,
    koFontFamily : koFonts[0].value,
    koFontWeight : koFonts[0].weight,

    sortFont : true,
    fontShadow : true,

    jaFonts : jaFonts,
    koFonts : koFonts
}

export const sharedSlice = createSlice({
    name : 'shared',
    initialState : initialState,
    reducers : {
        setBackgroundColor : (state, action) => {
            state.backgroundColor = action.payload;
        },
        setJaTextColor : (state, action) => {
            state.jaTextColor = action.payload;
        },
        setKoTextColor : (state, action) => {
            state.koTextColor = action.payload;
        },
        setJaFontSize : (state, action) => {
            state.jaTextFontSize = action.payload;
        },
        setKoFontSize : (state, action) => {
            state.koTextFontSize = action.payload;
        },
        setJaFontFamily : (state, action) => {
            state.jaFontFamily = action.payload;
        },
        setKoFontFamily : (state, action) => {
            state.koFontFamily = action.payload;
        },
        setSortFont : (state, action) => {
            state.sortFont = action.payload;
        },
        toggleFontShadow : (state) => {
            state.fontShadow = !state.fontShadow 
        }
    }
})

export const sharedActions = sharedSlice.actions // dispatch를 위한 설정 
export default sharedSlice.reducer;