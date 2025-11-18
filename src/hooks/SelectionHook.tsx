import { useState } from 'react';

import { useDebounceEffect } from 'hooks/OptimizationHook';

//Redux
import { useSelector } from 'react-redux';
import { store, RootState } from 'reducers/store';
import { selectionActions } from 'reducers/selectionReducer';
const { setSelection, setHurigana, setSelectedBun, setTextOffset, setOffset } = selectionActions;

const HANDLE_SELECTION_DELAY = 500;

//비 효울적임은 인지. but, mouseUp, Down으로 하기에는 정확하지 않음.
function useHandleSelection( document : Document, restrictId : string ) {
    //State
    const [restrict, setRestrict] = useState<string>(restrictId);

    const { selection, hurigana, selectedBun, textOffset, offset } = useSelector((_state : RootState) => _state.selection);

    //Handle
    //hurigana는 실질적인 사용은 없음. offset도 아마 그런 듯.
    const handleSelection = () => {
        const _selection = document.getSelection();

        if(_selection === null || _selection === undefined){
            return;
        }

        let text = _selection.toString();
        let startIndex = 0;
        let endIndex = 0;

        let _restrict = document.getElementById(restrict);

        if( _restrict === null || _restrict === undefined ){
            return;
        }

        let _anchor = _selection.anchorNode;
        let _focus = _selection.focusNode;
        
        if( _anchor === null || _focus === null ){
            return;
        }

        if(_selection?.containsNode(_restrict, true)){
            if( _restrict.contains(_anchor) === false || _restrict.contains(_focus) === false ){
                //restrict 범위를 벗어나는 경우
                return;
            }

            if(text === ''){
                return;
            }

            let el = null;
            let _text = text;
            if( _anchor !== null && _anchor !== undefined && _focus !== null && _focus !== undefined){
                let _position = _anchor.compareDocumentPosition(_focus);
                if( _position & Node.DOCUMENT_POSITION_FOLLOWING ){
                    el = _anchor.nodeName === '#text' ? _anchor.parentNode ?? _anchor : _anchor;
                    if( el.nodeName === 'RT'){
                        if( el.textContent ){
                            text = text.substring( el.textContent?.length );
                        }
                        el = el.parentNode?.nextSibling ?? el;
                    }
                    endIndex = el.textContent ? el.textContent.length - _selection.anchorOffset : 0;
                }
                else if( _position & Node.DOCUMENT_POSITION_PRECEDING ){
                    el = _focus.nodeName === '#text' ? _focus.parentNode ?? _focus : _focus;
                    if( el.nodeName === 'RT'){
                        if( el.textContent ){
                            text = text.substring( el.textContent?.length );
                        }
                        el = el.parentNode?.nextSibling ?? el;
                    }
                    endIndex = el.textContent ? el.textContent.length - _selection.focusOffset : 0;
                }

                _text = text;
                while(el){
                    if(el.nodeName === 'RUBY'){
                        let _RTNode = el.firstChild?.nextSibling;
                        if( _RTNode && _RTNode.textContent && el.textContent ){
                            let _data = _text.substring(startIndex, endIndex).replace( _RTNode.textContent, '' );
                            _text = _text.substring(0, startIndex) + _data + _text.substring(endIndex);

                            endIndex = startIndex + _data.length;
                        }
                    }
                    else if(el.nodeName === 'RT'){
                        _text = _text.substring(0, startIndex) + _text.substring(endIndex);
                    }

                    if( _text.length <= endIndex ){
                        break;
                    }

                    if( el.nodeName === 'RUBY' || el.nodeName === 'SPAN'){
                        startIndex = endIndex;
                        el = el.nextSibling;
                        if( el === null ){
                            break;
                        }   
                        endIndex += el.textContent ? el.textContent.length : 0;
                    }
                }
            }
            if (_text) {
                _text = _text.replace(/\n/g, '');

                store.dispatch( setSelection(_text) );
            }

            //용도 모름
            if(_selection?.isCollapsed === false){
                if(_selection?.anchorNode?.parentNode?.nodeName === 'RUBY'){
                    if(_selection?.anchorNode?.nextSibling){
                        if(_selection?.anchorNode?.nextSibling?.nodeName === 'RT'){
                            store.dispatch( setHurigana( (_selection.anchorNode.nextSibling as HTMLElement).innerText ) );
                        }
                    }
                }
                else{
                    store.dispatch( setOffset({startOffset : _selection.anchorOffset, endOffset : _selection.focusOffset}) );
                    store.dispatch( setHurigana('') );
                }
            }

            //Offset추출 : TextOffset
            if(_selection?.anchorNode?.parentNode && _selection?.focusNode?.parentNode){
                let anchorTextNode = _selection?.anchorNode?.parentNode as HTMLElement;
                let focusTextNode = _selection?.focusNode?.parentNode as HTMLElement;
                if(anchorTextNode?.getAttribute('data-bid') === focusTextNode?.getAttribute('data-bid')){
                    store.dispatch( setSelectedBun( anchorTextNode.getAttribute('data-bid') ?? '' ) );
                    let startOffset = Number(anchorTextNode.getAttribute('data-offset')) + _selection.anchorOffset;
                    let endOffset = Number(focusTextNode.getAttribute('data-offset')) + _selection.focusOffset;

                    //rt태그 다음의 빈 node선택 문제
                    let tmpFocusNode = _selection.focusNode as HTMLElement;
                    let tmpAnchorNode = _selection.focusNode as HTMLElement;

                    if(focusTextNode?.getAttribute('data-offset') === null && tmpFocusNode?.getAttribute !== undefined){
                        endOffset = Number(tmpFocusNode.getAttribute('data-offset')) + _selection.focusOffset;
                    }
                    if(anchorTextNode?.getAttribute('data-offset') === null && tmpAnchorNode?.getAttribute !== undefined){
                        startOffset = Number(tmpAnchorNode.getAttribute('data-offset')) + _selection.anchorOffset;
                    }

                    if(startOffset > endOffset){
                        store.dispatch( setTextOffset({startOffset : endOffset, endOffset : startOffset}) );
                    }
                    else{
                        store.dispatch( setTextOffset({startOffset : startOffset, endOffset : endOffset}) );
                    }
                }
            }

        }
    }

    useDebounceEffect( () => {
        document.addEventListener('selectionchange', handleSelection);
        return () => {
            document.removeEventListener('selectionchange', handleSelection);
        };
    }, HANDLE_SELECTION_DELAY, [])

    return { selection, hurigana, offset, selectedBun, textOffset, setRestrict };
}

export { useHandleSelection }