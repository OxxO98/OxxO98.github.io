import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

//CSS@Antd
import { Button } from 'antd';

const NotFoundPage = (  ) => {

    const { t } = useTranslation('NotFoundPage');

    const navigate = useNavigate();
    
    const handleToMain = () => {
        navigate('/');
    }

    return(
        <>
            <div>{t('MESSAGE.ERROR')}</div>
            <Button onClick={handleToMain}>{t('BUTTON.MOVE')}</Button>
        </>
    )
}

export { NotFoundPage }