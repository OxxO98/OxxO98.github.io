
import './App.scss';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HotkeysProvider } from 'react-hotkeys-hook';

//Page
import { NotFoundPage } from 'pages/NotFoundPage';
import { SharedPage } from 'pages/SharedPage';

//Component

//redux
import { Provider } from 'react-redux';
import { store } from 'reducers/store';

//CSS@Antd
import { ConfigProvider, theme } from 'antd';

const themeObj = {
    algorithm: theme.darkAlgorithm,
    token: {
        // Seed Token
        colorPrimary: '#d7000b',
        colorInfo: '#d7000b',
        borderRadius: 2
    },
    components : {
        Layout : {
            siderBg : '#161616ff',
            headerBg : '#262626',
            triggerBg : '#262626',
            algorithm : true
        },
        Menu : {
            darkItemBg : '#131313ff',
            darkSubMenuItemBg :'#080808',
            darkPopupBg :'#080808',
        }
    },
}

const App = () => {

    return (
        <div className="App">
            <ConfigProvider
                theme={themeObj}
            >
                <Provider store={store}>
                    <HotkeysProvider initiallyActiveScopes={['settings']}>
                        <BrowserRouter>
                                <Routes>
                                    <Route path="/shared" element={<SharedPage/>}/>
                                    <Route path="*" element={<NotFoundPage/>}/>
                                </Routes>
                        </BrowserRouter>
                    </HotkeysProvider>
                </Provider>
            </ConfigProvider>
        </div>
    );
}

export default App;
