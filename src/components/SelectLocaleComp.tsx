import React from 'react';
import { useTranslation } from 'react-i18next';

import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

const SelectLocaleComp = () => {
    
    const { i18n } = useTranslation();

    const onChange = (e: RadioChangeEvent) => {
        i18n.changeLanguage(e.target.value);
    };

    return(
        <Radio.Group defaultValue={i18n.language} size="middle" onChange={onChange}>
            <Radio.Button value="ko">한국어</Radio.Button>
            <Radio.Button value="ja">日本語</Radio.Button>
        </Radio.Group>
    )
}

export { SelectLocaleComp };