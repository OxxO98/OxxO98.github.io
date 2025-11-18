import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';

import { useHotkeys } from 'react-hotkeys-hook';

//Redux
import { useSelector } from 'react-redux';
import { store, RootState } from 'reducers/store';

//Hooks
import { useDebounce } from 'hooks/OptimizationHook';
import { FilteredDataContext } from 'contexts/FilteredDataContext';
import { VideoContext } from 'contexts/VideoContext';

//Redux@Reducers
import { reactPlayerActions } from 'reducers/reactPlayerReducer';
const { setStartTime, setEndTime, selectMarkerStart, selectMarkerEnd, unselectMarker } = reactPlayerActions;

function useVideoPlayHook( 
    playing : boolean, setPlaying : (playing : boolean) => void,
    state : ReactPlayerState,
    handleSeek : ( time : number ) => void
){
  //Context
  const { frameRate : frame } = useContext(VideoContext);
  const filteredData = useContext(FilteredDataContext);

  //Ref
  const markerTime = useRef<number>(null); //마커 play목적

  //State
  const DEBOUNCE_TIME_MS = 200;

  const [autoStop, setAutoStop] = useState<AutoStop>({
    set : false,
    startOffset : 0,
    endOffset : 0,
    loop : false
  });

  const { selectMarker, startTime, endTime } = useSelector((state : RootState) => state.reactPlayer);

  const { duration, playedSeconds } = state;

  //Hook
  const { floorFrame } = useTimeStamp();

  const debounce = useDebounce();

  //Handle
  const gotoTime = useCallback( (time : number, playBool : boolean | null) => {
    if(playedSeconds !== time){
      handleSeek(time);
    }
    if(playBool !== null){
      setPlaying(playBool);
    }
  }, [handleSeek, playedSeconds, setPlaying])

  const setScratch = useCallback( (set : boolean, startOffset : number, endOffset : number, loop : boolean) => {
    //autoStop은 played*duration의 형식, seconds
    if(set === true){
      handleSeek(startOffset);
    }

    setAutoStop((prev) => ({
      set : set,
      startOffset : startOffset,
      endOffset : endOffset,
      loop : loop
    }));
    
    if(set === true){
      if(playing === false){
        setPlaying(true);
      }
    }
    else{
      if(playing === true){
        setPlaying(false);
      }
    }
  }, [handleSeek, playing, setPlaying])

  const loop = () => {
    if(startTime === null || endTime === null){
      return;
    }

    if(autoStop.loop === false){
      handleSeek(startTime);
      setScratch(true, startTime, endTime, true);
    }
    else{
      setScratch(false, 0, 0, false);
    }
  }

  const pauseYT = () => {
    if(playing === true){
      //일단 markerTime 처럼 재생
      markerTime.current = playedSeconds;
      setPlaying(false);
    }
    else{
      setPlaying(true);
    }
  }

  //일단 현재 상태로는 play중에는 마커만 변경되서 그냥 두번 누를때 씹힐수 있음
  const prevFrame = useCallback( () => {
    if(playedSeconds - 1/frame < 0){
      return;
    }

    if(markerTime.current !== null && playing === true){
      markerTime.current -= 1/frame;
      gotoTime(markerTime.current, true);
    }
    else if( selectMarker !== null){
      if( selectMarker === 'startTime' && startTime !== null && endTime !== null && startTime > 0 ){
        let _startTime = floorFrame(startTime-(1/frame), frame);
        let _scratchEnd = Math.abs(endTime - startTime) > 1 ? _startTime + 1 : endTime;

        store.dispatch(setStartTime( _startTime ));
        gotoTime(_startTime, true);
        setScratch(true, _startTime, floorFrame( _scratchEnd, frame ), false);
      }
      else if( selectMarker === 'endTime' && startTime !== null && endTime !== null && endTime > 0 ){
        let _endTime = floorFrame(endTime-(1/frame), frame);

        store.dispatch(setEndTime( _endTime ));
        gotoTime(_endTime, false);
        setScratch(true, _endTime, floorFrame( _endTime+(4/frame), frame ), false);
      }
    }
    else{
      if(autoStop.set === false){
        let _curr = floorFrame(playedSeconds, frame);
        let _prev = floorFrame(_curr - 1/frame, frame);

        setScratch(true, _prev, playedSeconds, false);
      }
      else{
        setScratch(true, autoStop.startOffset - 1/frame, autoStop.startOffset, false);
      }
    }
  }, [autoStop.set, autoStop.startOffset, endTime, floorFrame, gotoTime, playedSeconds, playing, selectMarker, setScratch, startTime, frame])

  const debouncedPrev = debounce( prevFrame, DEBOUNCE_TIME_MS);

  const nextFrame = useCallback( () => {
    if(playedSeconds + 1/frame > duration){
      return;
    }

    if(markerTime.current !== null && playing === true){
      markerTime.current += 1/frame;
      gotoTime(markerTime.current, true);
    }
    else if(selectMarker !== null){
      if(selectMarker === 'startTime' && startTime !== null && endTime !== null && endTime < duration ){
        let _startTime = floorFrame(startTime+(1/frame), frame);
        let _scratchEnd = Math.abs(endTime - startTime) > 1 ? _startTime + 1 : endTime;

        store.dispatch(setStartTime( _startTime ));
        gotoTime( _startTime, true);
        setScratch(true, _startTime, floorFrame( _scratchEnd, frame ), false);
      }
      else if(selectMarker === 'endTime' && startTime !== null && endTime !== null && endTime < duration ){
        let _endTime = floorFrame(endTime+(1/frame), frame);
        
        store.dispatch(setEndTime( _endTime ));
        gotoTime(_endTime, false);
        setScratch(true, _endTime, floorFrame( _endTime+(4/frame), frame ), false);
      }
    }
    else{
      if( autoStop.set === false){
        let _curr = floorFrame(playedSeconds, frame);
        let _next = floorFrame(_curr + 1/frame, frame);
        let _end = floorFrame(_curr + 2/frame, frame);

        setScratch(true, _next, _end, false);
      }
      else{
        setScratch(true, autoStop.startOffset + 1/frame, autoStop.startOffset + 2/frame, false);
      }
    }
  }, [autoStop.set, autoStop.startOffset, endTime, floorFrame, gotoTime, playedSeconds, playing, selectMarker, setScratch, startTime, frame, duration])

  const debouncedNext = debounce( nextFrame, DEBOUNCE_TIME_MS);

  const getPrevAutoMarkerPoint = useCallback( (time : number, range : number, threshold : number) => {
    /*
      일단 급하락 지점을 찾음.
      또한 서서히 상승은 무시
      급 상승지점에선 이전 프레임 시간 반환.
      단, 이미 0.01값 이하면 반환.
      현재 1프레임 정도 뒤에서 찾는 경우가 있음.
    */
    let rangePointIndex = floorFrame(time, frame)*frame;
    let rangePrevIndex = rangePointIndex - range*frame;
    let minThreshold = 0.01;
    if(filteredData !== null){
      let rangeFilteredData = filteredData.right.filter( (arr, index) => ( rangePrevIndex < index && index <= rangePointIndex ) );

      let currTimeWaveRate = rangeFilteredData[rangeFilteredData.length - 1];

      if( threshold > currTimeWaveRate ){
        for(let i = rangeFilteredData.length-2; i >= 0; i--){
          let currFrameTime = rangeFilteredData.length-1-i;

          if( rangeFilteredData[i] > rangeFilteredData[i+1] ){

            return floorFrame(time - (currFrameTime-1)/frame, frame);
          }
        }
      }

      let maxWaveRate = currTimeWaveRate;
      //이미 0.01이하면 현재 시간 반환.
      if( minThreshold > currTimeWaveRate ){

        return floorFrame(time, frame);
      }
      //기준치보다 낮은 marker 탐색.
      // length : 30, length-1 : 29 lastIndex, length-2 :첫 비교.
      let lastThreshold = null;
      for(let i = rangeFilteredData.length-2; i >= 0; i-- ){
        let currFrameTime = rangeFilteredData.length-1-i;

        if( maxWaveRate - rangeFilteredData[i] > threshold ){
          if(lastThreshold !== null){
            if(rangeFilteredData[lastThreshold] > rangeFilteredData[i]){
              lastThreshold = i;
            }
            else{

              return floorFrame(time - (rangeFilteredData.length-1-lastThreshold)/frame, frame);
            }
          }
          else{
            lastThreshold = i;
          }
        }
        else if( minThreshold > rangeFilteredData[i] ){

          return floorFrame(time - (currFrameTime)/frame, frame);
        }
        maxWaveRate = Math.max(maxWaveRate, rangeFilteredData[i]);
      }

      return floorFrame(time, frame);
    }
    else{
      return time;
    }
  }, [filteredData, floorFrame, frame])

  const getNextAutoMarkerPoint = useCallback( (time : number, range : number, threshold : number) => {
    /*
      getPrevAutoMarkerPoint에서 반대로 수정.
    */
    let rangePointIndex = floorFrame(time, frame)*frame;
    let rangeNextIndex = rangePointIndex + range*frame;
    let minThreshold = 0.01;

    if(filteredData !== null){
      let rangeFilteredData = filteredData.right.filter( (arr, index) => ( rangePointIndex <= index && index < rangeNextIndex ) );

      let currTimeWaveRate = rangeFilteredData[0];

      if( threshold > currTimeWaveRate ){
        for(let i = 1; i <= rangeFilteredData.length-1; i++){
          let currFrameTime = i;

          if( rangeFilteredData[i] > rangeFilteredData[i-1] ){

            return floorFrame(time + (currFrameTime-1)/frame, frame);
          }
        }
      }

      let maxWaveRate = currTimeWaveRate;
      //이미 0.01이하면 현재 시간 반환.
      if( minThreshold > currTimeWaveRate ){

        return floorFrame(time, frame);
      }
      //기준치보다 낮은 marker 탐색.
      let lastThreshold = null;
      for(let i = 1; i <= rangeFilteredData.length-1; i++){
        let currFrameTime = i;

        if( maxWaveRate - rangeFilteredData[i] > threshold ){
          if(lastThreshold !== null){
            if(rangeFilteredData[lastThreshold] > rangeFilteredData[i]){
              lastThreshold = i;
            }
            else{

              return floorFrame(time + (lastThreshold)/frame, frame);
            }
          }
          else{
            lastThreshold = i;
          }
        }
        else if( minThreshold > rangeFilteredData[i] ){

          return floorFrame(time + (currFrameTime)/frame, frame);
        }
        maxWaveRate = Math.max(maxWaveRate, rangeFilteredData[i]);
      }

      return floorFrame(time, frame);
    }
    else{
      return time;
    }
  }, [filteredData, floorFrame, frame])

  const prevSec = useCallback( () => {
    let sec = playedSeconds;

    if(playedSeconds - 1 < 0){
      gotoTime(0, false);
      return;
    }

    //일단 추가해보기
    if(markerTime.current !== null && playing === true){
      markerTime.current -= 1;
      gotoTime(markerTime.current, true);
    }
    else if(selectMarker !== null){
      if(selectMarker === 'startTime' && startTime && endTime){
        let autoMarkerPoint = getPrevAutoMarkerPoint( startTime, 1, 0.5 );
        store.dispatch(setStartTime(autoMarkerPoint));
        gotoTime(autoMarkerPoint, true);
        setScratch(true, autoMarkerPoint, endTime, false);
      }
      else if(selectMarker === 'endTime' && startTime && endTime){
        let autoMarkerPoint = getPrevAutoMarkerPoint( endTime, 1, 0.5 );
        store.dispatch(setEndTime( autoMarkerPoint ));
        gotoTime(startTime, true);
        setScratch(true, startTime, autoMarkerPoint, false);
      }
    }
    else{
      if(autoStop.set === false){
        let _curr = floorFrame(sec, frame);
        let _prev = floorFrame(_curr-1, frame);
        let _end = floorFrame(_prev + (4/frame), frame);

        setScratch(true, _prev, _end, false);
      }
      else{
        gotoTime( floorFrame(autoStop.startOffset-1, frame), false )
        // setScratch(true, autoStop.startOffset-1, autoStop.startOffset-1+(4/frame), false);
      }
    }
  }, [autoStop.set, autoStop.startOffset, endTime, floorFrame, frame, gotoTime, playedSeconds, playing, selectMarker, setScratch, startTime, getPrevAutoMarkerPoint])

  const nextSec = useCallback( () => {
    let sec = playedSeconds;

    if(playedSeconds + 1 > duration){
      gotoTime(duration, false);
      return;
    }

    if(markerTime.current !== null && playing === true){
      markerTime.current += 1;
      gotoTime(markerTime.current, true);
    }
    else if(selectMarker !== null){
      if(selectMarker === 'endTime' && startTime && endTime){
        let autoMarkerPoint = getNextAutoMarkerPoint( endTime, 1, 0.5);
        store.dispatch(setEndTime( autoMarkerPoint ));
        gotoTime(startTime, true);
        setScratch(true, startTime, autoMarkerPoint, false);
      }
      else if(selectMarker === 'startTime' && startTime && endTime){
        let autoMarkerPoint = getNextAutoMarkerPoint( startTime, 1, 0.5 );
        store.dispatch(setStartTime( autoMarkerPoint ));
        gotoTime(autoMarkerPoint, true);
        setScratch(true, autoMarkerPoint, endTime, false);
      }
    }
    else{
      if(autoStop.set === false){
        let _curr = floorFrame(sec, frame);
        let _next = floorFrame(_curr+1, frame);
        let _end = floorFrame(_next + (4/frame), frame);

        setScratch(true, _next, _end, false);
      }
      else{
        gotoTime( floorFrame(autoStop.startOffset+1, frame), false )
        // setScratch(true, autoStop.startOffset+1, autoStop.startOffset+1+(4/frame), false);
      }
    }
  }, [autoStop.set, autoStop.startOffset, endTime, floorFrame, frame, gotoTime, playedSeconds, playing, selectMarker, setScratch, startTime, duration, getNextAutoMarkerPoint])

  const selectStartTime = () => {
    if(selectMarker !== 'startTime' && startTime !== null){
      gotoTime(startTime, null);
      store.dispatch(selectMarkerStart())
    }
    else{
      store.dispatch(unselectMarker());
    }
  }

  const selectEndTime = () => {
    if(selectMarker !== 'endTime' && endTime !== null){
      gotoTime(endTime, null);
      store.dispatch(selectMarkerEnd());
    }
    else{
      store.dispatch(unselectMarker());
    }
  }

  const markStart = () => {
      store.dispatch( setStartTime( floorFrame( playedSeconds, frame) ) );
  }

  const markEnd = () => {
      store.dispatch( setEndTime( floorFrame( playedSeconds, frame) ) );
  }

  const markerPlay = () => {
    store.dispatch( unselectMarker() );
    //멈췄을 경우는 새로 marker를 찍고 play 재생중일 경우는 marker로 가서 재생
    if(playing === false){
      //pause
      markerTime.current = playedSeconds;
      setPlaying(true);
    }
    else{
      if(markerTime.current !== null){
        gotoTime(markerTime.current, true);
      }
    }
  }

  const nextMarkerPlay = () => {
    if(playing === false){
      if(endTime !== null){
        store.dispatch(setStartTime( endTime ));
        store.dispatch(setEndTime(null));
        store.dispatch(unselectMarker());
        gotoTime(endTime, null);
        setPlaying(true);
      }
      else{
        store.dispatch(setStartTime( floorFrame( playedSeconds, frame) ));
        store.dispatch(setEndTime(null));
        store.dispatch(unselectMarker());
        setPlaying(true);
      }
    }
    else{
      store.dispatch(setEndTime( floorFrame( playedSeconds, frame) ));
      setPlaying(false);
    }
  }

  const markerStop = () => {
    if(markerTime.current !== null){
      gotoTime(markerTime.current, false);
    }
    setPlaying(false);
  }

  const checkAutoStop = useCallback( ( playedSeconds : number ) => {
    if(autoStop.set === true){
      if(playedSeconds > autoStop.endOffset){
        if(autoStop.loop === false){
          handleSeek(autoStop.startOffset);
          setScratch(false, 0, 0, false);
        }
        else{
          handleSeek(autoStop.startOffset);
        }
      }
    }
  }, [handleSeek, setScratch, autoStop.set, autoStop.startOffset, autoStop.endOffset, autoStop.loop])

  useEffect(()=>{
    checkAutoStop(playedSeconds);
  }, [checkAutoStop, playedSeconds]);

  useEffect( () => {
    if(playing === false){
      markerTime.current = null;
      setScratch(false, 0, 0, false);
    }
  }, [playing, setScratch])

  useEffect( () => {
    if(endTime !== null){
      if(startTime !== null){
        if(startTime > endTime){
          store.dispatch(setEndTime( startTime ));
          store.dispatch(setStartTime( endTime ));
        }
      }
    }
  }, [startTime, endTime])

  const keyboard = {
    pauseYT : pauseYT,
    prevSec : prevSec,
    nextSec : nextSec,
    prevFrame : debouncedPrev,
    nextFrame : debouncedNext,
    gotoTime : gotoTime,
    markStart : markStart,
    markEnd : markEnd,
    selectStartTime : selectStartTime,
    selectEndTime : selectEndTime,
    markerPlay : markerPlay,
    markerStop : markerStop,
    loop : loop,
    nextMarkerPlay : nextMarkerPlay
  }

  const videoPlayerHandles = {
    gotoTime : gotoTime,
    setScratch : setScratch,
    keyboard : keyboard,
    autoStop : autoStop
  }

  return { gotoTime, loop, pauseYT, prevFrame : debouncedPrev, nextFrame : debouncedNext, prevSec, nextSec, setScratch, markerPlay, keyboard, autoStop, setAutoStop, selectStartTime, selectEndTime, selectMarker, videoPlayerHandles }
}

function useTimeStamp(){

  const timestampEdit = (ts : string) => {
    let indexT = ts.indexOf('T');
    let indexZ = ts.indexOf('Z');

    let sliceTs = ts.substring(indexT+1, indexZ);

    return sliceTs;
  }

  const timeToTS = (time : number) => {
    let hour = Math.floor(time/3600);
    let min = Math.floor(time/60);
    let sec = Math.floor(time%60);
    let msec = Math.floor(time%1*1000);

    let ts_hour = '00';
    let ts_min = '00';
    let ts_sec = '00';

    if(hour < 10){
      ts_hour = '0'+hour;
    }
    else{
      ts_hour = ''+hour;
    }
    if(min < 10){
      ts_min = '0'+min;
    }
    else if(min >= 60){
      ts_min = ''+min%60;
    }
    else{
      ts_min = ''+min;
    }
    if(sec < 10){
      ts_sec = '0'+sec;
    }
    else{
      ts_sec = ''+sec;
    }

    return ts_hour+':'+ts_min+':'+ts_sec+'.'+String(msec).padStart(3, '0');
  }

  const timeToFrameTime = (time : number, frame : number) => {
    let hour = Math.floor(time/3600);
    let min = Math.floor(time/60);
    let sec = Math.floor(time%60);
    let frameTime = Math.floor( (time%1*1000)/(1000/frame) );

    let ts_hour = '00';
    let ts_min = '00';
    let ts_sec = '00';

    if(hour < 10){
      ts_hour = '0'+hour;
    }
    else{
      ts_hour = ''+hour;
    }
    if(min < 10){
      ts_min = '0'+min;
    }
    else if(min >= 60){
      ts_min = ''+min%60;
    }
    else{
      ts_min = ''+min;
    }
    if(sec < 10){
      ts_sec = '0'+sec;
    }
    else{
      ts_sec = ''+sec;
    }

    return ts_hour+':'+ts_min+':'+ts_sec+'.'+frameTime;
  }

  const tsToTime = (ts : string) => {
    let indexT = ts.indexOf('T');
    let indexZ = ts.indexOf('Z');

    let sliceTs = ts.substring(indexT+1, indexZ);
    let indexMsec = sliceTs.indexOf('.');

    let stringMsec = sliceTs.substring(indexMsec+1);
    let stringHMS = sliceTs.substring(0,indexMsec);
    let tsArray = stringHMS.split(':');

    let hour = parseInt(tsArray[0]);
    let min = parseInt(tsArray[1]);
    let sec = parseInt(tsArray[2]);
    let msec = parseInt(stringMsec)/1000;

    return hour*3600 + min*60 + sec + msec;
  }

  const floorFrame = useCallback( (time : number, frameRate : number) => {
    let sec = Math.floor(time);
    let msec = time - sec;

    let frame = Math.floor( msec / (1/frameRate) );
    //오차 범위 보정
    if( Math.abs( Math.abs( frame*(1/frameRate) - msec ) - (1/frameRate) ) <= 0.00001 ){
      frame = Math.round( msec / (1/frameRate) );
    }

    return sec + frame*(1/frameRate);
  }, [])

  const frameTime = useCallback( (time : number, frameRate : number) => {
    let sec = Math.floor(time);
    let msec = time - sec;

    let frame = Math.floor( msec / (1/frameRate) );

    return { sec : sec, frame : frame, frameRate : frameRate }
  }, [])

  const getFrame = useCallback( (frame : number, frameRate : number) => {
    let value = frame%frameRate;
    if( value < 0 ){
      value += frameRate;
    }

    return value;
  }, [])

  const timeToFrameStamp = (time : number, frameRate : number) => {
    let msec = time - Math.floor(time);
    let frame = Math.floor( msec / (1/frameRate) );

    if( Math.abs( Math.abs( frame*(1/frameRate) - msec ) - (1/frameRate) ) <= 0.00001 ){
      frame = Math.round( msec / (1/frameRate) );
    }

    let hour = Math.floor(time/3600);
    let min = Math.floor(time/60%60);
    let sec = Math.floor(time%60);

    let ts_hour = String(hour).padStart(2, '0');
    let ts_min = String(min).padStart(2, '0');
    let ts_sec = String(sec).padStart(2, '0');
    let ts_frame = String(frame).padStart(2, '0');

    return ts_hour+':'+ts_min+':'+ts_sec+'.'+ ts_frame;
  }

  return { timeToTS, timeToFrameTime, tsToTime, floorFrame, frameTime, getFrame, timeToFrameStamp, timestampEdit }
}

function useHandleKeyboard(
  handleObj : HandleKeyboardObj
){

  useHotkeys('*', (_) => {
    switch(_.key){
      case " ":
        if( handleObj?.pauseYT ){ handleObj.pauseYT() }
        break;
      case "z":
        if( handleObj?.prevSec ){ handleObj?.prevSec() }
        break;
      case "v":
        if( handleObj?.nextSec ){ handleObj?.nextSec() }
        break;
      case "x":
        if( handleObj?.prevFrame ){ handleObj?.prevFrame() }
        break;
      case "c":
        if( handleObj?.nextFrame ){ handleObj?.nextFrame() }
        break;
      case "a":
        if( handleObj?.markStart ){ handleObj?.markStart() }
        break;
      case "f":
        if( handleObj?.markEnd ){ handleObj?.markEnd() }
        break;
      case "s":
        if( handleObj?.selectStartTime ){ handleObj?.selectStartTime() }
        break;
      case "d":
        if( handleObj?.selectEndTime ){ handleObj?.selectEndTime() }
        break;
      case "b":
        if( handleObj?.markerPlay ){ handleObj?.markerPlay() }
        break;
      case "g":
        if( handleObj?.markerStop ){ handleObj?.markerStop() }
        break;
      case 'r' :
        if( handleObj?.loop ){ handleObj?.loop() }
        break;
      case 'n' :
        if( handleObj?.nextMarkerPlay ){ handleObj?.nextMarkerPlay() }
        break;
      default :
        if( handleObj?.custom ){
          let custom = handleObj.custom;
          let customAction = custom.filter( (v) => v.key === _.key );
          if( customAction.length !== 0 ){ customAction[0].action() }
        }
    }
  }, { preventDefault : true } );

  const handleKeyboard = (e : React.KeyboardEvent) =>{
    switch(e.key){
      case " ":
        if( handleObj?.pauseYT ){ handleObj.pauseYT() }
        break;
      case "z":
        if( handleObj?.prevSec ){ handleObj?.prevSec() }
        break;
      case "v":
        if( handleObj?.nextSec ){ handleObj?.nextSec() }
        break;
      case "x":
        if( handleObj?.prevFrame ){ handleObj?.prevFrame() }
        break;
      case "c":
        if( handleObj?.nextFrame ){ handleObj?.nextFrame() }
        break;
      case "a":
        if( handleObj?.markStart ){ handleObj?.markStart() }
        break;
      case "f":
        if( handleObj?.markEnd ){ handleObj?.markEnd() }
        break;
      case "s":
        if( handleObj?.selectStartTime ){ handleObj?.selectStartTime() }
        break;
      case "d":
        if( handleObj?.selectEndTime ){ handleObj?.selectEndTime() }
        break;
      case "b":
        if( handleObj?.markerPlay ){ handleObj?.markerPlay() }
        break;
      case "g":
        if( handleObj?.markerStop ){ handleObj?.markerStop() }
        break;
      case 'r' :
        if( handleObj?.loop ){ handleObj?.loop() }
        break;
      case 'n' :
        if( handleObj?.nextMarkerPlay ){ handleObj?.nextMarkerPlay() }
        break;
      default :
        if( handleObj?.custom ){
          let custom = handleObj.custom;
          let customAction = custom.filter( (v) => v.key === e.key );
          if( customAction.length !== 0 ){ customAction[0].action() }
        }
    }
  }

  return { handleKeyboard }
}

export { useVideoPlayHook, useTimeStamp, useHandleKeyboard }
