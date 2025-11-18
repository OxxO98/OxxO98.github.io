const LayoutComp : Locale["LayoutComp"] = {
    HOME : '홈'

}

const LayoutCompYoutube : Locale["LayoutCompYoutube"] = {
    ...LayoutComp,
    VIDEO : '비디오',
    MARKING : '마킹',
    TIMELINE : '타임라인',
    HONYAKU : '번역',
    TANGOCHOU : '단어장'
}

const SharedModalComp : Locale["SharedModalComp"] = {
    TITLE : 'URL을 복사해 공유합니다',
    MESSAGE : {
        SUCCESS : '복사 완료!',
        ERROR : '복사 실패'
    },
    BUTTON : {
        TITLE : '공유하기',
        CANCLE : '취소',
        COPY : '복사하기',
        SAVE : 'JSON 파일로 저장',
        SAVE_CAPTION_JA : '일본어 자막으로 저장',
        SAVE_CAPTION_KO : '한국어 자막으로 저장'
    }

}

const NewVideoComp : Locale["NewVideoComp"] = {
    TITLE : '새 영상을 추가합니다',
    STEPS : ['유튜브 주소 입력', '제목 입력'],
    BUTTON : {
        TITLE : '동영상 추가',
        NEXT : '다음',
        PREV : '이전',
        DONE : '확인'
    },
    LABEL : [ 'Youtube URL', '제목' ]
}

const TimelineComp : Locale["TimelineComp"] = {
    BUTTON : {
        PART_TRANSCRIPT : '부분 음성인식',
        SAVE_NEW : '작성',
        CANCLE : '취소',
        MODIFY_TIME : '시간 수정'
    }
}

const TimelineBun : Locale["TimelineBun"] = {
    BUTTON : {
        MODIFY : '수정',
        MOVE : '이동'
    }
}

const UpdateBunJaTextModalComp : Locale["UpdateBunJaTextModalComp"] = {
    TITLE : '문장을 수정합니다',
    BUTTON : {
        TITLE : '문장 수정',
        CANCLE : '취소',
        DONE : '확인'
    },
    CONTENTS : [ '수정된 단어', '삭제된 단어']
}

const DeleteBunModalComp : Locale["DeleteBunModalComp"] = {
    TITLE : '문장을 삭제합니다',
    BUTTON : {
        TITLE : '삭제',
        CANCLE : '취소',
        DONE : '확인'
    },
    CONTENTS : [ '삭제된 단어' ]
}

const BunkatsuTimelineComp : Locale['BunkatsuTimelineComp'] = {
    TITLE : '분할 하시겠습니까?',
    BUTTON : {
        TITLE : '분할',
        CANCLE : '취소',
        DONE : '분할'
    },
    CONTENTS : [ '분할할 부분을 "/"로 표시해 주세요.']
}

const HeigouTimelineComp : Locale['HeigouTimelineComp'] = {
    TITLE : '병합 하시겠습니까?',
    BUTTON : {
        TITLE : '병합',
        CANCLE : '취소',
        DONE : '병합'
    },
    CONTENTS : [ '두 문장을 병합 합니다. 대표 번역문이 아닌 경우는 병합되지 않습니다.']
}

const MakeDrftComp : Locale["MakeDrftComp"] = {
    TITLE : '초안을 작성합니다',
    BUTTON : {
        TITLE : '초안 작성',
        RE_TRANSCRIPT : '음성인식 재작성',
        DONE_TRANSCRIPT : '음성인식으로 작성',
        DONE_CAPTION : '자막으로 작성',
        CANCLE : '닫기'
    },
    CONTENTS : ['자막', '음성인식']
}

const AudioWaveComp : Locale["AudioWaveComp"] = {
    BUTTON : {
        PLAYING : ' ',
        SCRATCH : ' ',
        ZOOM_IN : '확대',
        ZOOM_OUT : '축소'
    }
}

const HelpModal : Locale["HelpModal"] = {
    TITLE : '단축키 도움말',
    BUTTON : {
        TITLE : '단축키 도움말',
        CANCLE : '닫기'
    },
    CONTENTS : [
        {
            TITLE : '재생 컨트롤 z,x,c,v',
            ITEMS : [
                'z : 1초전', 'x : 1프레임 전', 'c : 1프레임 후', 'v : 1초후'
            ]
        },
        {
            TITLE : 'start, end 마커 컨트롤',
            ITEMS : [
                'a : Start마커 선택', 's : start마커 설정', 'd : end마커 설정', 'f : end마커 선택', '마커 선택시, zxcv로 변경 가능'
            ]
        },
        {
            TITLE : '마커 플레이 컨트롤',
            ITEMS : [
                'b : 해당 시점에 마커 설정 후 재생', 'g : 마커로 이동하며 정지', 'z : 마커 시점 1초 전', 
                'x : 마커 사점 1프레임 전', 'c : 마커 시점 1프레임 후', 'v : 마커 시점 1초 후'
            ]
        },
        {
            TITLE : '부가 기능',
            ITEMS : [
                'r : start-end 마커 사이 loop 기능', 'n : 현재 endTime을 startTime으로 설정 한뒤, 재생, 다시 입력시 해당 시점을 end마커로 설정.'
            ]
        },
        {
            TITLE : 'timeline에서',
            ITEMS : [
                'start, end마커 클릭시 해당 마커 선택', 'x, c로 1프레임씩 이동 가능', 
                'z, v로 자동 오디오 파형의 끝점으로 이동기능 (불안정)', 
                'q : 오토 마커로, start는 이전 timeline의 end로 설정, end마커는 이후 timeline의 start시간으로 설정',
                '우측 방향키, 왼쪽 방향키로 타임라인 이동'
            ]
        }
    ]
}

const DictionaryComp : Locale['DictionaryComp'] = {
    MESSAGE : {
        ERROR : '사용할 수 없는 문자가 포함되어 있음'
    }
}

const HonyakuController : Locale['HonyakuController'] = {
    BUTTON : {
        DELETE : '삭제',
        SAVE_NEW : '새로 저장',
        MODIFY : '수정',
        CANCLE : '취소'
    }
}

const HonyakuRepresentive : Locale['HonyakuRepresentive'] = {
    BUTTON : {
        MODIFY : '수정'
    },
    MESSAGE : {
        EMPTY : '번역 없음'
    }
}

const HukumuBunComp : Locale['HukumuBunComp'] = {
    BUTTON : {
        TITLE : '추가하기'
    }
}

const TangoComp : Locale['TangoComp'] = {
    CONTENTS : {
        YOMI : '읽기',
        TANGO : '표기'
    },
    BUTTON : {
        CANCLE : '취소',
        MODIFY : '수정'
    }
}

const DynamicInputComp : Locale['DynamicInputComp'] = {
    CONTENTS : {
        YOMI : '읽기',
        TANGO : '표기'
    }
}

const ModalTangoDB : Locale['ModalTangoDB'] = {
    TITLE : '새 단어를 등록합니다',
    BUTTON : {
        TITLE : '확인',
        SAVE_NEW : '새로운 단어로 등록',
        CANCLE : '취소'
    }
}

const AccordianTangoDB : Locale['AccordianTangoDB'] = {
    CONTENTS : {
        SEARCHED_LIST : ["표기 읽기 완전 일치", "일부 완전 완전 일치", "후방 일치", "전방 일치", "오쿠리가나 일치", "그외"],
        MESSAGE : '검색결과 : {{count}}개'
    }
}

const TangoDB : Locale['TangoDB'] = {
    CONTENTS : {
        EMPTY : '등록된 뜻 없음'
    },
    BUTTON : {
        DONE : '이 단어로 등록'
    }
}

const ModalUpdateHukumu : Locale['ModalUpdateHukumu'] = {
    TITLE : '읽기를 수정하시겠습니까?',
    BUTTON : {
        TITLE : '수정',
        MODIFY : '수정',
        CANCLE : '닫기'
    },
    MESSAGE : [
        [ '기존 ', '가 ', '로 변경됩니다.'],
        [ '변경 전 읽기 : ' ],
        [ '변경 후 읽기 : ' ]
    ]
}

const ModalDeleteHukumu : Locale['ModalDeleteHukumu'] = {
    TITLE : '정말 삭제 하시겠습니까?',
    BUTTON : {
        TITLE : '삭제',
        DELETE : '삭제',
        CANCLE : '닫기'
    }
}

const ImiComp : Locale['ImiComp'] = {
    CONTENTS : {
        TANGO : '단어',
        IMI : '뜻'
    },
    BUTTON : {
        DONE : '확인',
        DELETE : '삭제'
    }
}

const Osusume : Locale['Osusume'] = {
    BUTTON : {
        TITLE : '추가하기'
    }
}

const Tango : Locale['Tango'] = {
    BUTTON : {
        MOVE : '단어장으로 이동'
    }
}

const TangochouRepresentive : Locale['TangochouRepresentive'] = {
    BUTTON : {
        MOVE : '단어로'
    }
}

const TangoInfo : Locale['TangoInfo'] = {
    BUTTON : {
        BACK : '뒤로',
        CLOSE : '닫기'
    }
}

const KanjiInfo : Locale['KanjiInfo'] = {
    BUTTON : {
        MOVE : '단어로',
        BACK : '뒤로',
        CLOSE : '닫기'
    }
}

const PdfModalComp : Locale['PdfModalComp'] = {
    TITLE : 'pdf로 변환 합니다',
    BUTTON : {
        TITLE : 'PDF로 변환',
        REVIEW : '미리보기',
        SAVE : '저장'
    },
    SELECT : {
        TANGO_ONLY : '단어만 표시',
        KANJI_ONLY : '한자만 표시',
        BOTH : '둘다 표시',
    }
}

const TimelineCarouselComp : Locale['TimelineCarouselComp'] = {
    BUTTON : {
        PREV : '이전',
        CURR : '현재 시간 이동',
        NEXT : '다음',
        MODIFY : '수정',
        CANCLE : '취소'
    }
}

const TimelineCarouselHonyakuComp : Locale['TimelineCarouselHonyakuComp'] = {
    BUTTON : {
        PREV : '이전',
        CURR : '현재 시간 이동',
        NEXT : '다음'
    }
}

const AiComp : Locale['AiComp'] = {
    BUTTON : {
        NEW_CHAT : '새로 질문하기',
        DONE : '확인',
        CANCLE : '취소'
    }
}

//NOT_FOUND
const NotFoundPage : Locale['NotFoundPage'] = {
    MESSAGE : {
        ERROR : '페이지를 찾을 수 없습니다'
    },
    BUTTON : {
        MOVE : '메인으로'
    }
}

//SHARED
const SharedPage : Locale['SharedPage'] = {
    BUTTON : {
        SAVE_CAPTION_JA : '일본어 자막으로 저장',
        SAVE_CAPTION_KO : '한국어 자막으로 저장'
    }
}

const SharedTimelineCarouselComp : Locale['SharedTimelineCarouselComp'] = {
    BUTTON : {
        PREV : '이전',
        CURR : '현재 시간 이동',
        NEXT : '다음'
    },
    SELECT : {
        JATEXT_ONLY : '일본어만',
        KOTEXT_ONLY : '한국어만',
        BOTH : '둘다 표시',
    }
}

const SharedBunSettingModalComp : Locale['SharedBunSettingModalComp'] = {
    TITLE : '세팅',
    BUTTON : {
        DONE : '확인',
        CANCLE : '취소'
    },
    CONTENTS : [
        '한국어 일본어 순서', '폰트 프리셋', '일본어 설정', '한국어 설정', '배경 설정', '테두리 설정'
    ]
}

const SharedDictionaryComp : Locale['SharedDictionaryComp'] = {
    ...DictionaryComp
}

export default {
    LayoutComp,
    LayoutCompYoutube,
    
    SharedModalComp,
    NewVideoComp,

    TimelineComp,
    TimelineBun,

    UpdateBunJaTextModalComp,
    DeleteBunModalComp,
    BunkatsuTimelineComp,
    HeigouTimelineComp,

    MakeDrftComp,

    AudioWaveComp,
    HelpModal,

    DictionaryComp,

    HonyakuController,
    HonyakuRepresentive,

    HukumuBunComp,

    TangoComp,
    DynamicInputComp,
    ModalTangoDB,
    AccordianTangoDB,
    TangoDB,

    ModalUpdateHukumu,
    ModalDeleteHukumu,

    ImiComp,

    Osusume,

    Tango,

    TangochouRepresentive,
    TangoInfo,
    KanjiInfo,
    PdfModalComp,

    TimelineCarouselComp,
    TimelineCarouselHonyakuComp,

    AiComp,

    NotFoundPage,

    SharedPage,
    SharedTimelineCarouselComp,
    SharedBunSettingModalComp,
    SharedDictionaryComp,
} as Locale