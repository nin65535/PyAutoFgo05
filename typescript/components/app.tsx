import * as React from 'react'
import { eel } from '../eel'

import { AppContextProvider, AppContext } from 'components/appContextProvider'
import { PagedBody } from 'components/pagedBody'
import { EEL_SET_POS, EEL_LOG, EEL_PLAY_END, useEelEvent } from 'components/eelEvents'
export function App(): JSX.Element {
    return <AppContextProvider>
        <AppMain />
    </AppContextProvider>
}

function AppMain(): JSX.Element {
    const { state, dispatcher } = React.useContext(AppContext)
    const isStageInitialized = React.useRef<boolean>(false)

    //アプリ開始時に一回だけステージ情報を読み込む
    if (!isStageInitialized.current) {
        eel.get_stages()(stages => dispatcher({ type: 'setStages', value: stages }))
        isStageInitialized.current = true
    }

    //コンポーネント生成時にイベントリスナを仕込む
    useEelEvent(EEL_LOG, (event: CustomEvent) => {
        dispatcher({ type: 'addLog', value: event.detail })
    })
    useEelEvent(EEL_SET_POS, (event: CustomEvent) => {
        dispatcher({ type: 'setPos', value: event.detail })
    })
    useEelEvent(EEL_PLAY_END, (event: CustomEvent) => {
        const [stage_no, cmd_no] = event.detail
        dispatcher({ type: 'setPos', value: [stage_no, cmd_no, 0] })
    })

    return (<>
        <Header></Header>
        <PagedBody></PagedBody>
    </>)
}
function Header(): JSX.Element {
    return <header className='bg-primary text-white'>
        <div className='container'>
            <h1>PyAutoFgo04</h1>
        </div>
    </header>
}
