import * as React from 'react'
import { NavSelector } from 'components/navSelector'
import { AppContext } from 'components/appContextProvider'
import { Home } from 'components/home'
import { Stages } from 'components/stages'
import { Commands } from 'components/commands'

type Page = { label: string, component: React.FC }
export const PagedBody: React.FC = function (props) {
    const { state, dispatcher } = React.useContext(AppContext)
    const setPage = (p: number) => dispatcher({ type: 'setPage', value: p })

    const pages: Page[] = [
        { label: 'Home', component: Home },
        { label: 'Stages', component: Stages },
        { label: 'Commands', component: Commands },
    ]

    const labels = pages.map(p => p.label)
    const Body = pages[state.page].component

    return <div className="container">
        <NavSelector labels={labels} currentValue={state.page} setValue={setPage}></NavSelector>
        <Body></Body>
    </div>

}