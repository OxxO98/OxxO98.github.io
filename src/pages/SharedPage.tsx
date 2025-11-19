import React, { useContext, useEffect, useState, useRef, useMemo, CSSProperties, useCallback } from 'react';
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';

import ReactPlayer from 'react-player';

import LZstring from 'lz-string'

import VirtualList, { ListRef } from 'rc-virtual-list';

//Context
import { VideoContext } from 'contexts/VideoContext';

//Components
import { ComplexText } from 'components/Bun';
import { SelectLocaleComp } from 'components/SelectLocaleComp'

//Hook
import { useReactPlayerHook } from 'hooks/ReactPlayerHook';
import { useHandleKeyboard, useVideoPlayHook } from 'hooks/VideoPlayHook';

import { useJaText } from 'hooks/JaTextHook';
import { useHandleSelection } from 'hooks/SelectionHook';

import { useTimeStamp } from 'hooks/VideoPlayHook';

//Redux
import { useSelector } from 'react-redux';
import { store, RootState } from 'reducers/store';
import { sharedActions } from 'reducers/sharedReducer';

//CSS@antd
import { Layout, Splitter, Flex, Row, Col, Button, List, theme, Space, Select, Modal, Slider, Switch, ColorPicker, Divider, Empty, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons'
import type { ColorPickerProps, GetProp } from 'antd';
    
type Color = GetProp<ColorPickerProps, 'value'>;
const { Header, Content } = Layout; //Import 위에 있으면 안됨.
const { useToken } = theme; 

const { setBackgroundColor, setJaTextColor, setKoTextColor, setJaFontSize, setKoFontSize, setSortFont, setJaFontFamily, setKoFontFamily, toggleFontShadow } = sharedActions;

interface SharedTimeline {
    id : string;
    startTime : number;
    endTime : number;
    jaText : Array<TextData>;
    koText : string;
}

interface SharedData {
    videoId : string;
    timeline : SharedTimeline[];
}

interface SharedCompProps {
    sharedData : SharedData;
}

const TimelineControlstyle : CSSProperties = {
    height : '70px',
    alignContent : 'center'
}


const SharedPage = () => {
    const { t } = useTranslation('SharedPage');

    const [sharedData, setSharedData] = useState<SharedData | null>(null);

    const location = useLocation();

    //Hook
    const { timeToTS } = useTimeStamp()

    const handleSaveByCaption = ( opt : 'ko' | 'ja' = 'ja' ) => {
        if(sharedData === null ){ return }

        let filename = `CAPTION_${sharedData.videoId}`;

        let _captionData = sharedData.timeline.map( (v) => {
            return {
                startTime : timeToTS(v.startTime),
                endTime : timeToTS(v.endTime),
                jaText : v.jaText.map( (j) => j.data ).join(''),
                koText : v.koText ?? ''
            }
        })

        let _toJaCaption = _captionData.map( (v, i) => {
            return `${i}\n${v.startTime} --> ${v.endTime}\n${ opt === 'ko' ? v.koText : v.jaText }\n`
        }).join('\n')
        
        let blob = new Blob([_toJaCaption], {type: "text/plain;charset=utf-8"});
        saveAs(blob, `${filename}.srt`);
    }

    useEffect( () => {
        let search = location.search;
        let params = new URLSearchParams(search);
        let encode = params.get('a');

        if(encode !== null){
            let decode = LZstring.decompressFromEncodedURIComponent(encode);
            let decodedData : RES_SHARED_DATA = JSON.parse(decode);
            
            console.log(decodedData.t[0].j !== undefined)
            console.log(decodedData.t[0].k !== undefined)

            let data = {
                videoId : decodedData.v,
                timeline : decodedData.t.map( (v, i) => {
                    return {
                        startTime : v.s,
                        endTime : v.e,
                        jaText : v.j === undefined ? 
                            [{
                                data : '',
                                ruby : null,
                                offset : 0
                            }]
                            :
                            typeof v.j === 'string' ?  
                                [{
                                    data : v.j,
                                    ruby : null,
                                    offset : 0
                                }]
                            : 
                                v.j.map( (t) => {
                                    return {
                                        data : t.d,
                                        ruby : t.r,
                                        offset : t.o
                                    }
                                })
                            ,
                        koText : v.k === undefined ? 
                            ''
                            :
                            v.k
                        ,
                        id : i.toString()
                    }
                }),
            }
            setSharedData(data);
        }
    }, [location])

    return(
        <>
            <VideoContext.Provider value={{ videoId : sharedData?.videoId!, frameRate : 30 }}>
                <Layout style={{ height : '100vh' }}>
                    <Header style={{ padding: 0 }}>
                        <Flex align='center' gap={16} justify='right' style={{ height : '100%', margin : '0 16px'}}>
                            <Button onClick={() => handleSaveByCaption()}>{t('BUTTON.SAVE_CAPTION_JA')}</Button>
                            <Button onClick={() => handleSaveByCaption('ko')}>{t('BUTTON.SAVE_CAPTION_KO')}</Button>
                            <SelectLocaleComp/>
                        </Flex>
                    </Header>
                    <Content>
                    {
                        sharedData !== null &&
                        <SharedComp sharedData={sharedData}/>
                    }
                    </Content>
                </Layout>
            </VideoContext.Provider>
        </>
    )
}

const SharedComp = ({ sharedData } : SharedCompProps ) => {
    //Context
    const { videoId } = useContext(VideoContext); 

    //State

    //Hook
    const { state, playerRef, setPlayerRef, playerHandles } = useReactPlayerHook(videoId);
        
    useHandleSelection(document, 'activeRange');

    return (
        <>
            <Splitter style={{ height: '100%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <Splitter.Panel collapsible defaultSize="0%" min="25%" max="25%" resizable={false}>
                    <SharedDictionaryComp />
                </Splitter.Panel>
                <Splitter.Panel defaultSize="100%" min="50%" max="100%">  
                    <Flex vertical align='center' style={{ position : 'relative'}}>
                        <SharedVideoComp playerRef={playerRef} setPlayerRef={setPlayerRef} state={state} playerHandles={playerHandles}/>
                        <SharedTimelineCarouselComp timeline={sharedData.timeline} playerRef={playerRef} state={state} playerHandles={playerHandles}/>
                    </Flex>
                </Splitter.Panel>
                <Splitter.Panel collapsible defaultSize="0%" min="30%" max="50%">
                    <SharedTimelineComp timeline={sharedData.timeline} playerRef={playerRef} state={state} playerHandles={playerHandles}/>
                </Splitter.Panel>
            </Splitter>
        </>
    )
}

interface SharedVideoCompProps {
    playerRef : React.RefObject<HTMLVideoElement | null>;
    setPlayerRef : ( player : HTMLVideoElement ) => void;
    state : ReactPlayerState;
    playerHandles : PlayerHandles;
}

interface SharedTimelineCarouselCompProps {
    timeline : SharedTimeline[];
    playerRef : React.RefObject<HTMLVideoElement | null>;
    state : ReactPlayerState;
    playerHandles : PlayerHandles;
}

type SharedTimelineCompProps = SharedTimelineCarouselCompProps;

interface SharedBunProps {
    textData : TextData[];
}

interface SharedBunSettingModalCompProps {
    children : React.ReactNode;
}

const SharedVideoComp = ({ playerRef, setPlayerRef, state, playerHandles } : SharedVideoCompProps) => {

    //State
    const { handlePlay, handlePause, handleDurationChange } = playerHandles;

    const {
        src,
        pip,
        playing,
        volume,
        muted,
    } = state;

    return(
        <>
            <div style={{ width : '100%', maxWidth : '70%'}}>
                <ReactPlayer
                    ref={setPlayerRef}
                    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                    src={src}
                    pip={pip}
                    playing={playing}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onDurationChange={handleDurationChange}
                    controls={false}
                    loop={true}
                    volume={volume}
                    muted={muted}
                    playsInline={true}
                />
            </div>
        </>
    )
}

const SharedBun = ({ textData } : SharedBunProps ) => {
    const _bId = 'bId'.concat( textData.map( (v) => v.offset ).join('') )
    
    return(
        <>
        {
            textData.map( (v) => 
                <ComplexText bId={_bId} offset={v.offset} data={v.data} ruby={v.ruby}/>
            )
        }
        </>
    )
}

const SharedTimelineCarouselComp = ({ timeline, playerRef, state, playerHandles } : SharedTimelineCarouselCompProps ) => {

    const { t } = useTranslation('SharedTimelineCarouselComp');
            
    const substitudeBox = useRef<HTMLDivElement>(null); //자막 박스
    const [boxHeight, setBoxHeight] = useState<number>(800);

    //Redux
    const { backgroundColor, jaTextColor, koTextColor,  jaTextFontSize, koTextFontSize, jaFontFamily, koFontFamily, sortFont, fontShadow, jaFontWeight, koFontWeight } = useSelector( (_state : RootState) => _state.shared );

    const TimelineBunStyle : CSSProperties = {
        width : '100%',
        textAlign : 'center',
        position : 'absolute',
        margin : 'auto',
        backgroundColor : backgroundColor,
        transform : `translate(-50%, 0)`
    }

    const textShadow = fontShadow ? '-1px 0px black, 0px 1px black, 1px 0px black, 0px -1px black' : '';

    const JaTextStyle : CSSProperties = {
        fontSize : jaTextFontSize,
        color : jaTextColor,
        fontFamily : jaFontFamily,
        fontWeight : jaFontWeight,
        textShadow: textShadow
    }
    
    const KoTextStyle : CSSProperties = {
        fontSize : koTextFontSize,
        color : koTextColor,
        fontFamily : koFontFamily,
        fontWeight : koFontWeight,
        textShadow: textShadow
    }

    //State
    const [currentBunId, setCurrentBunId] = useState(0);

    const { playing, playedSeconds } = state;
    const { handlePausePlay, handleSeek } = playerHandles;

    const boxStyle = useMemo( () => {
        return {
            bottom : `${boxHeight}px`,
            left : `50%`
        }
    }, [boxHeight])
    
    const [bunSelect, setBunSelect] = useState({ ja : true, ko : true });

    const { setScratch, gotoTime, keyboard } = useVideoPlayHook( playing, handlePausePlay, state, handleSeek );
    
    const customKeyBoard = [
        { key : 'ArrowRight', action : () => { nextTimeLine() } },
        { key : 'ArrowLeft', action : () => { prevTimeLine() } }
    ]
    const filteredKeyboard = {
        pauseYT : keyboard.pauseYT,
        prevSec : keyboard.prevSec, 
        nextSec : keyboard.nextSec,
        prevFrame : keyboard.prevFrame,
        nextFrame : keyboard.nextFrame,
        markerPlay : keyboard.markerPlay,
        markerStop : keyboard.markerStop,
        loop : keyboard.loop
    }
    useHandleKeyboard({ ...filteredKeyboard, custom : customKeyBoard }); //autoKeyboard는 나중에 추가 바람.
    
    //Handle @timeline
    const prevTimeLine = () => {
        if( timeline === null ){
            return;
        }

        if(currentBunId > 0){
            let curr = timeline[currentBunId-1];
            //setScratch(true, curr.startTime, curr.endTime, false);
            gotoTime(curr.startTime, true);

            setCurrentBunId(currentBunId-1);
        }
    }

    const nextTimeLine = () => {
        if( timeline === null ){
            return;
        }
        
        if(currentBunId+1 < timeline.length){
            let curr = timeline[currentBunId+1];
            //setScratch(true, curr.startTime, curr.endTime, false);
            gotoTime(curr.startTime, true);

            setCurrentBunId(currentBunId+1);
        }
    }

    const currentTimeLine = () => {
        if( timeline === null ){
            return;
        }
        
        let curr = timeline[currentBunId];
        setScratch(true, curr.startTime, curr.endTime, false);
    }
    
    const getCurrentTimeLine = useCallback( () => {
        if( timeline === null ){
            return null;
        }

        let a = timeline.findIndex( (arr) =>
            arr.startTime <= playedSeconds &&
            playedSeconds < arr.endTime
        );
        let b = timeline.findIndex( (arr) =>
            arr.startTime === playedSeconds
        );
        
        if( a !== -1 ){
            if( b !== -1 ){
                return b;
            }
            else{
                return a;
            }
        }
        return null;
    }, [timeline, playedSeconds])

    const moveCurrentTimeLine = useCallback( () => {
        if(playedSeconds !== null){
            if(timeline !== null){
                let curTL = getCurrentTimeLine();
                if( curTL !== null){
                    setCurrentBunId( curTL );
                }
            }
        }
    }, [playedSeconds, timeline, getCurrentTimeLine])

    const handelSelectChange = ( value : string ) => {
        if( value === 'jaOnly'){ setBunSelect({ ja : true, ko : false }) }
        if( value === 'koOnly'){ setBunSelect({ ja : false, ko : true }) }
        if( value === 'both'){ setBunSelect({ ja : true, ko : true }) }
    }

    useEffect( () => {
        moveCurrentTimeLine();
    }, [moveCurrentTimeLine])

    useEffect( () => {
        if(substitudeBox.current !== null){
            const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { height } = entry.contentRect;
                setBoxHeight(height);
            }
            });

            observer.observe(substitudeBox.current);
        }
    }, [])
    

    return(
        <>
            <div>
                <div>
                    <div style={TimelineControlstyle}>
                        <Flex justify='center' align='center' gap='middle'>
                            <Button onClick={prevTimeLine}>{t('BUTTON.PREV')}</Button>
                            <Button onClick={currentTimeLine}>{t('BUTTON.CURR')}</Button>
                            <Button onClick={nextTimeLine}>{t('BUTTON.NEXT')}</Button>
                            <Select defaultValue="both"
                                style={{ minWidth : 120 }}
                                onChange={handelSelectChange}
                                options={[
                                    { value: 'jaOnly', label: t('SELECT.JATEXT_ONLY') },
                                    { value: 'koOnly', label: t('SELECT.KOTEXT_ONLY') },
                                    { value: 'both', label: t('SELECT.BOTH') },
                            ]}/>
                            <SharedBunSettingModalComp>
                                <Flex vertical justify='center' style={TimelineBunStyle}>
                                {
                                    sortFont ? 
                                    <>
                                    {
                                        bunSelect.ko &&
                                        <div style={KoTextStyle}>
                                            {timeline[currentBunId].koText}
                                        </div>
                                    }
                                    {
                                        bunSelect.ja &&
                                        <div style={JaTextStyle}>
                                            <SharedBun textData={timeline[currentBunId].jaText}/>
                                        </div>
                                    }
                                    </>
                                    :
                                    <>
                                    {
                                        bunSelect.ja &&
                                        <div style={JaTextStyle}>
                                            <SharedBun textData={timeline[currentBunId].jaText}/>
                                        </div>
                                    }
                                    {
                                        bunSelect.ko &&
                                        <div style={KoTextStyle}>
                                            {timeline[currentBunId].koText}
                                        </div>
                                    }
                                    </>
                                }
                                </Flex>
                            </SharedBunSettingModalComp>
                        </Flex>
                    </div>
                    <Flex vertical justify='center' style={{ ...TimelineBunStyle, ...boxStyle }} ref={substitudeBox}>
                    {
                    timeline !== null && timeline.length !== 0 &&
                    <>
                    {
                        sortFont ? 
                        <>
                        {
                            bunSelect.ko &&
                            <div style={KoTextStyle}>
                                {timeline[currentBunId].koText}
                            </div>
                        }
                        {
                            bunSelect.ja &&
                            <div id="activeRange" style={JaTextStyle}>
                                <SharedBun textData={timeline[currentBunId].jaText}/>
                            </div>
                        }
                        </>
                        :
                        <>
                        {
                            bunSelect.ja &&
                            <div id="activeRange" style={JaTextStyle}>
                                <SharedBun textData={timeline[currentBunId].jaText}/>
                            </div>
                        }
                        {
                            bunSelect.ko &&
                            <div style={KoTextStyle}>
                                {timeline[currentBunId].koText}
                            </div>
                        }
                        </>
                    }
                    </>
                    }
                    </Flex>
                </div>
            </div>
        </>
    )
}

const SharedBunSettingModalComp = ({ children } : SharedBunSettingModalCompProps ) => {

    const { t } = useTranslation('SharedBunSettingModalComp');

    //State
    const [isModalOpen, setIsModalOpen] = useState(false);

    //Redux
    const { backgroundColor, jaTextColor, koTextColor, jaTextFontSize, koTextFontSize, sortFont, fontShadow, jaFonts, koFonts, jaFontFamily, koFontFamily } = useSelector( (_state : RootState ) => _state.shared );

    const presets = [
        { value : 0, label : '각진 고딕1', ja : jaFonts[0].value, ko : koFonts[0].value },
        { value : 1, label : '각진 고딕2', ja : jaFonts[4].value, ko : koFonts[2].value },
        { value : 2, label : '둥근 고딕', ja : jaFonts[1].value, ko : koFonts[3].value },
        { value : 3, label : '손글씨1', ja : jaFonts[7].value, ko : koFonts[5].value },
        { value : 4, label : '손글씨2', ja : jaFonts[7].value, ko : koFonts[6].value },
        { value : 5, label : '도트1', ja : jaFonts[6].value, ko : koFonts[4].value },
        { value : 6, label : '도트2', ja : jaFonts[6].value, ko : koFonts[7].value },
    ]

    //Handle
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //폰트 설정
    const handelJaFontSelectChange = (value : string) => {
        store.dispatch( setJaFontFamily(value) );
    }

    const handelKoFontSelectChange = (value : string) => {
        store.dispatch( setKoFontFamily(value) );
    }

    const handelPresetChange = (value : number) => {
        store.dispatch( setJaFontFamily(presets[value].ja ) ) 
        store.dispatch( setKoFontFamily(presets[value].ko ) )
    }

    //텍스트 설정
    const onJaFontSizeChange = (value : number) => {
        store.dispatch( setJaFontSize(value) );
    }

    const onKoFontSizeChange = (value : number) => {
        store.dispatch( setKoFontSize(value) );
    }

    const onSortChange = ( checked : boolean ) => {
        store.dispatch( setSortFont(checked) );
    }

    //Color설정
    const onBackgroundColorChange = ( color : Color, css : string ) => {
        store.dispatch( setBackgroundColor(css) );
    }
    const onJaTextColorChange = ( color : Color, css : string ) => {
        store.dispatch( setJaTextColor(css) );
    }
    const onKoTextColorChange = ( color : Color, css : string ) => {
        store.dispatch( setKoTextColor(css) );
    }

    //테두리 설정
    const onChange = (checked : boolean) => {
        store.dispatch( toggleFontShadow() );
    };

    return(
        <>
            <Button onClick={showModal}>
                <SettingOutlined />
            </Button>

            <Modal
                title={t('TITLE')}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onCancel={handleCancel}
                width={'80%'}
                footer={[
                    <Button onClick={handleCancel}>{t('BUTTON.CANCLE')}</Button>,
                    <Button type='primary' onClick={handleOk}>{t('BUTTON.DONE')}</Button>
                ]}
            >
                {children}
                <Row>
                    <Col span={4}>
                        {t('CONTENTS.0')}
                    </Col>
                    <Col span={4}>
                        <Switch value={sortFont} onChange={onSortChange}/>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={4}>
                        {t('CONTENTS.1')}
                    </Col>
                    <Col span={4}>
                        <Select
                            defaultValue={presets[0].value}
                            style={{ minWidth : 120 }}
                            onChange={handelPresetChange}
                            options={presets}/>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={4}>
                        {t('CONTENTS.2')}
                    </Col>
                    <Col span={12}>    
                        <Slider
                            min={12}
                            max={60}
                            onChange={onJaFontSizeChange}
                            value={jaTextFontSize}
                        />
                    </Col>
                    <Col span={4}>
                        <ColorPicker value={jaTextColor} onChange={onJaTextColorChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col offset={4}>
                        <Select
                            defaultValue={jaFonts[0].value}
                            value={jaFontFamily}
                            style={{ minWidth : 120 }}
                            onChange={handelJaFontSelectChange}
                            options={jaFonts}/>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={4}>
                        {t('CONTENTS.3')}
                    </Col>
                    <Col span={12}>  
                        <Slider
                            min={12}
                            max={60}
                            onChange={onKoFontSizeChange}
                            value={koTextFontSize}
                        />  
                    </Col>
                    <Col span={4}>
                        <ColorPicker value={koTextColor} onChange={onKoTextColorChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col offset={4}>
                        <Select
                            defaultValue={koFonts[0].value}
                            value={koFontFamily}
                            style={{ minWidth : 120 }}
                            onChange={handelKoFontSelectChange}
                            options={koFonts}/>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={4}>
                        {t('CONTENTS.4')}
                    </Col>
                    <Col span={4}>
                        <ColorPicker value={backgroundColor} onChange={onBackgroundColorChange}/>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={4}>
                        {t('CONTENTS.5')}
                    </Col>
                    <Col span={4}>
                        <Switch value={fontShadow} onChange={onChange}/>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

const SharedTimelineComp = ({ timeline, playerRef, state, playerHandles } : SharedTimelineCompProps ) => {
    
    const divBox = useRef<HTMLDivElement>(null); //canvas Div Box 크기
    const [divBoxHeight, setDivBoxHeight] = useState<number>(800);
    const virtualRef = useRef(null);

    //hook
    const { playing, playedSeconds } = state;
    const { handlePlay, handleSeek } = playerHandles;

    const { gotoTime } = useVideoPlayHook( playing, handlePlay, state, handleSeek );
    
    //CSS@antd
    const { token } = useToken();

    //handle @timeline
    const moveTimeLine = useCallback( () => {
        if(playedSeconds !== null){
            if(timeline !== null){
                let a = timeline.findIndex( (v) =>
                    v.startTime < playedSeconds &&
                    playedSeconds < v.endTime
                )
                if( a !== -1 ){
                    return a;
                }
            }
        }
    }, [timeline, playedSeconds]);

    const goToTimeLine = ( i : number ) => {
        let curr = timeline[i];
        gotoTime(curr.startTime, null)
    }

    //Memo
    const currentBunId = useMemo( () => { return moveTimeLine() }, [moveTimeLine])

    useEffect( () => {
        if( virtualRef.current !== null && currentBunId !== undefined ){
            (virtualRef.current as ListRef).scrollTo({ index : currentBunId, align : 'top', offset : divBoxHeight/2 });
        }
    }, [currentBunId, divBoxHeight])
    
    useEffect( () => {
        if(divBox.current !== null){
            const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { height } = entry.contentRect;
                setDivBoxHeight(height);
            }
            });

            observer.observe(divBox.current);
        }
    }, [])

    return(
        <>
            <Flex vertical style={{ height : '100%' }}>
                <div style={{ width : "100%", height : "100%", overflow : "hidden"}} ref={divBox}>
                {
                    timeline !== null &&
                    <List bordered>
                        <VirtualList
                            data={timeline}
                            height={divBoxHeight}
                            itemHeight={47}
                            itemKey="id"
                            ref={virtualRef}
                        >
                        {
                            (v, i) => (
                                <List.Item
                                    style={ (currentBunId !== undefined && currentBunId === i) ? { background :  token.colorPrimaryBg } : undefined}
                                >
                                    <div style={{ width : "100%" }} onClick={() => goToTimeLine(i)}>
                                        <Flex justify="left" style={{ width : "100%" }}>
                                            <Space align='baseline'>
                                                <SharedBun textData={timeline[i].jaText}/>
                                            </Space>
                                        </Flex>
                                        <Flex justify="space-between" style={{ width : "100%" }}>
                                            {timeline[i].koText}
                                        </Flex>
                                    </div>
                                </List.Item>
                            )
                        }
                        </VirtualList>
                    </List>
                }
                </div>
            </Flex>
        </>
    )
}

const DictionaryStyle = {
  width : "100%",
  height : "100%"
}

//네이버 사전
const SharedDictionaryComp = () => {
    
    const { t } = useTranslation('SharedDictionaryComp');

    //Redux
    const { selection } = useSelector( (_state : RootState) => _state.selection );

    //Hook
    const { checkKatachi } = useJaText();

    return(
        <>
        {
            selection && selection !== '　' && selection !== ' ' && selection.length < 10 && checkKatachi(selection) !== null ?
            <div style={DictionaryStyle}>
                <iframe title='dictionary_naver' src={'https://ja.dict.naver.com/?m=mobile#/search?range=all&query=' + selection} style={DictionaryStyle}></iframe>
            </div>
            :
            <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                    <Typography.Text>
                        {t('MESSAGE.ERROR')}
                    </Typography.Text>
                }
            />
        }
        </>
    )
}

export { SharedPage };