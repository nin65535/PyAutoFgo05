import * as React from 'react'
import { eel } from '../eel.js'
import { EEL_PLAY_END, useEelEvent } from 'components/eelEvents'
import { AppContext } from 'components/appContextProvider'
import { NavSelector } from 'components/navSelector'
import { StageSelector } from 'components/stages'
import { Log } from 'components/log'
export const Commands: React.FC = function (props) {
    const style = {
        height: "35rem",
        overflow: "auto",
    }
    return (<>
        <Console></Console>
        <StageSelector />
        <CommandSelector></CommandSelector>
        <div style={style}>
            <CommandList></CommandList>
        </div>
        <Log></Log>
    </>)
}

const Console: React.FC = function () {
    const { state, dispatcher } = React.useContext(AppContext)
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false)

    const onPlay = () => {
        eel.play(state.current_stage, state.current_command)
        setIsPlaying(true)
    }

    const onStop = () => eel.stop()

    useEelEvent(EEL_PLAY_END, () => {
        setIsPlaying(false)
    })

    const pClass: string = isPlaying ? 'btn-primary disabled' : 'btn-outline-primary'
    const sClass: string = isPlaying ? '' : 'disabled'

    return <div className="my-2">
        <button className={"btn mr-2 " + pClass} onClick={onPlay}>
            <i className="fas fa-play"></i>
        </button>
        <button className={"btn btn-outline-primary mr-2 " + sClass} onClick={onStop}>
            <i className="fas fa-stop"></i>
        </button>
    </div>
}

const CommandSelector: React.FC = function () {
    const { state, dispatcher } = React.useContext(AppContext)
    const labels = state.stages[state.current_stage].commands.map((c, i) => String(i))
    const setValue = (i: number) => dispatcher({ type: "setCurrentCommand", value: i })
    const currentValue = state.current_command
    const props = { labels, currentValue, setValue }
    return <NavSelector {...props} />
}

const CommandList: React.FC = function () {
    const { state } = React.useContext(AppContext)

    const command = state.stages[state.current_stage].commands[state.current_command]

    const rows = command.map((line, i) => {
        const key = "command-" + state.current_stage +
            '-' + state.current_command +
            '-' + i

        return <CommandListRow key={key} line_no={i} >{line}</CommandListRow>
    })

    return <table className="table table-sm">
        <tbody>
            {rows}
        </tbody>
    </table>
}

const CommandListRow: React.FC<{ children: JSX.Element | string, line_no: number }> = function (props) {
    const { state } = React.useContext(AppContext)
    const className = (state.current_line == props.line_no) ? 'table-active' : ''

    return (<tr className={className} >
        <td className='text-right' style={{ width: '2rem' }}>
            {props.line_no}
        </td>
        <td>
            {props.children}
        </td>
    </tr>)

}