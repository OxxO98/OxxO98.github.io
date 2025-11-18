import { createSlice } from '@reduxjs/toolkit'

interface initialStateInterface {
  startTime : number | null;
  endTime : number | null;
  selectMarker : string | null;
}

const initialState : initialStateInterface = {
  startTime : null,
  endTime : null,
  selectMarker : null,
} 

//to context : duration, frameRate, playing, filteredData
//분할 : autoStop, playing

export const reactPlayerSlice = createSlice({
  name : 'reactPlayer', // action 이름을 만드는데 사용되는 키 
  initialState, // 리듀서에서 사용될 state값을 정의
  reducers : { // 객체 타입. switch등으로 만들어 사용하던 케이스들을 아래와 같이 설정하면 됨 
    setStartTime : (state, action) => {
      state.startTime = action.payload
    },
    setEndTime : (state, action) => {
      state.endTime = action.payload
    },
    selectMarkerStart : (state) => {
      state.selectMarker = 'startTime'
    },
    selectMarkerEnd : (state) => {
      state.selectMarker = 'endTime'
    },
    unselectMarker : (state) => {
      state.selectMarker = null
    },
  }
})

export const reactPlayerActions = reactPlayerSlice.actions // dispatch를 위한 설정 
export default reactPlayerSlice.reducer;