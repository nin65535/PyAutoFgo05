import * as React from 'react'
import { AppContext } from 'components/appContextProvider'

export const Log: React.FC = function (props) {
    const { state, dispatcher } = React.useContext(AppContext)

    const textarea = React.createRef<HTMLTextAreaElement>();

    React.useEffect(() => {
        const obj = textarea.current
        obj.scrollTop = obj.scrollHeight
    })

    const onErase = function () {
        dispatcher({ type: 'clearLog', value: null })
    }

    return <div style={{ position: "relative" }}>
        <button className="btn btn-secondary"
            onClick={onErase}
            style={{
                position: "absolute",
                top: 0,
                right: 0
            }}>
            <i className="fas fa-eraser"></i>
        </button>
        <textarea
            className='form-control bg-white'
            value={state.log}
            readOnly
            style={{ height: "10rem" }}
            ref={textarea}
        />
    </div>
}
