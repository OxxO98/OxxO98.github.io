//Hooks
import { useHuri } from 'hooks/HuriHook';

import { v4 as uuidv4 } from 'uuid';

//Redux
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/store';

interface ComplexTextProps {
    bId : string | null;
    data : string;
    ruby : string | null;
    offset : number;
}

interface TextProps {
    bId : string | null;
    data : string;
    ruby : string | null;
    offset : number;
}

interface KanjiTextProps {
    hyouki : string;
    yomi : string;
    onClick : ( kanji : string ) => void;
}

const ComplexText = ({ bId, data, ruby, offset } : ComplexTextProps) => {

    const { complexArr } = useHuri();

    const _key = ( v : TextData ) => bId !== undefined && bId !== null ? `${bId}-${v['offset']}` : uuidv4();

    return(
        <>
        {
            complexArr(data, ruby ?? null, offset ?? 0).map( (arr : TextData) =>
                <Text key={_key(arr)} offset={arr['offset']} bId={bId} data={arr['data']} ruby={arr['ruby']}/>
            )
        }
        </>
    )
}

const Text = ({ bId, data, ruby, offset } : TextProps ) => {

    //Redux
    const { styled } = useSelector( (_state : RootState) => _state.selection );

    const convertStyled = () => {
        let tmpArr = [];

        if(styled !== null && styled !== undefined && styled.bId === bId && styled.bId !== '' ){
            let { startOffset, endOffset } = styled;
            let startTextOffset = offset;
            let endTextOffset = offset + data.length;

            let styleOpt = "highlight";

            if(styled.opt === 'bold'){
                styleOpt = "bold";
            }

            if( startTextOffset <= startOffset && endOffset <= endTextOffset ){
                // Text가 styled를 포함 하는 경우.
                if( startOffset-startTextOffset > 0 ){
                    tmpArr.push({
                        data : data.substring(0, startOffset-startTextOffset), style : null,
                        offset : startTextOffset
                    });
                }
                tmpArr.push({
                    data : data.substring(startOffset-startTextOffset, endOffset-startTextOffset), ruby : ruby, style : styleOpt,
                    offset : startOffset
                });
                if( endTextOffset-endOffset > 0 ){
                    tmpArr.push({
                        data : data.substring(endOffset-startTextOffset), style : null,
                        offset : endOffset
                    });
                }
            }
            else if( startOffset <= startTextOffset && endTextOffset <= endOffset ){
                // styled에 Text가 포함 된 경우.
                tmpArr.push({
                    data : data, ruby : ruby, style : styleOpt,
                    offset : offset
                });
            }
            else{
                tmpArr.push({
                    data : data, ruby : ruby, style : null,
                    offset : offset
                });
            }
        }
        else{
            tmpArr.push({
                data : data, ruby : ruby, style : null,
                offset : offset
            });
        }

        return tmpArr;
    }

    let _offset = (v : number) => offset !== null && offset !== undefined ? v : '0';

    return(
        <>
        {
        convertStyled().map( (arr) => {
            if(arr?.ruby === null || arr?.ruby === undefined){
                return(
                    <span className={`${arr.style !== null ? arr.style : ''} rubyNasi`} data-bid={bId} data-offset={_offset(arr.offset)} key={bId+'-'+arr.offset}>
                        {arr.data}
                    </span>
                )
            }
            else{
                return(
                    <ruby className={`${arr.style !== null ? arr.style : ''} rubyAri`} data-bid={bId} data-offset={_offset(arr.offset)} key={bId+'-'+arr.offset}>
                        {arr.data}
                        <rt>
                            {arr.ruby}
                        </rt>
                    </ruby>
                )
            }
        })
        }
        </>
    )
}

//단어장의 단어 정보 onClick이벤트를 위해 만듬.
const KanjiText = ({ hyouki, yomi, onClick } : KanjiTextProps ) => {
    const { complexArr } = useHuri();

    const converKanjiTextList = (hyouki : string) => {
        let list = [];

        for(let i=0; i<hyouki.length; i++){
            list.push(
                <span onClick={() => onClick(hyouki[i])} key={i.toString()}>
                    {hyouki[i]}
                </span>
            )
        }

        return list;
    }

    return(
        <div className="largeTango">
        {
            complexArr(hyouki, yomi, 0).map( (arr : TextData) => {
                if(arr.ruby === null){
                    return( <span key={arr.data}>{arr.data}</span> );
                }
                else{
                    return(
                        <ruby key={arr.data}>
                            {
                                converKanjiTextList(arr.data)
                            }
                            <rt>{arr.ruby}</rt>
                        </ruby>
                    )
                }
            })
        }
        </div>
    )
}

export { Text, ComplexText, KanjiText };
