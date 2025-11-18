import { createSlice } from '@reduxjs/toolkit'

interface SelctionInitial {
    selection : string;
    hurigana : string;
    offset : OffsetObj | null;
    selectedBun : string;
    textOffset : OffsetObj;
    hukumuData : HukumuData | null;
    styled : StyledObj | null;
}

const initialState : SelctionInitial = {
    selection : '',
    hurigana : '',
    offset : null,
    selectedBun : '',
    textOffset : { startOffset : 0, endOffset : 0 },
    hukumuData : null,
    styled : null
} 

export const selectionSlice = createSlice({
    name : 'selection', // action 이름을 만드는데 사용되는 키 
    initialState, // 리듀서에서 사용될 state값을 정의
    reducers : { // 객체 타입. switch등으로 만들어 사용하던 케이스들을 아래와 같이 설정하면 됨 
        setSelection : (state, action) => {
            state.selection = action.payload;
        },
        setHurigana : (state, action) => {
            state.hurigana = action.payload;
        },
        setOffset : (state, action) => {
            state.offset = action.payload;
        },
        setSelectedBun : (state, action) => {
            state.selectedBun = action.payload;
        },
        setTextOffset : (state, action) => {
            state.textOffset = action.payload;
        },
        setHukumuData : (state, action) => {
            state.hukumuData = action.payload;
        },
        setStyled : (state, action) => {
            state.styled = action.payload;
        },
        clear : (state) => {
            state.selection = '';
            state.hurigana = '';
            state.offset = null;
            state.selectedBun = '';
            state.textOffset = { startOffset : 0, endOffset : 0 };
            state.hukumuData = null;
            state.styled = null;
        },
        clearSelection : (state) => {
            state.selectedBun = '';
            state.textOffset = { startOffset : 0, endOffset : 0 };
            state.hukumuData = null;
            state.styled = null;
        }
    }
})

export const selectionActions = selectionSlice.actions // dispatch를 위한 설정 
export default selectionSlice.reducer;