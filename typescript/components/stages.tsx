import * as React from 'react'
import { eel } from '../eel.js'
import { AppContext } from 'components/appContextProvider'

export const Stages: React.FC = (props) => {
    const { state } = React.useContext(AppContext)

    const servants = state.stages[state.current_stage].servants.map((s, i) => <tr key={'servant-' + state.current_stage + '-' + i}><td>{s}</td></tr>)

    return (<>
        <StageSelector />
        <table className="table table-sm">
            <tbody>
                {servants}
            </tbody>
        </table>
    </>)
}

export const StageSelector: React.FC = function () {
    const { state, dispatcher } = React.useContext(AppContext)

    const options = state.stages.map((stage, i) =>
        (<option key={"stage-" + stage.label} value={i}>{stage.label}</option>))

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
        dispatcher({ type: 'setCurrentStage', value: Number(event.target.value) })

    return < ReloadButton >
        <select className='form-control' value={state.current_stage} onChange={onChange}>
            {options}
        </select>
    </ReloadButton >
}

const ReloadButton: React.FC = ({ children }) => {
    const { dispatcher } = React.useContext(AppContext)
    const [reload, setReload] = React.useState<boolean>(false)
    const disabled = reload ? ' disabled' : ''

    function onClick() {
        setReload(true)
        eel.update_stages()()
            .then(() => eel.get_stages()())
            .then(stages => {
                dispatcher({ type: 'setStages', value: stages })
                setReload(false)
            })
    }
    return (<div className="input-group mb-2">
        {children}
        <div className="input-group-append">
            <button
                className={"btn btn-secondary" + disabled}
                type="button"
                onClick={onClick}>
                <i className="fas fa-sync"></i>
            </button>
        </div>
    </div>)
}
