import * as React from 'react'
import { Log } from 'components/log'
import { eel } from '../eel.js'

export function Home(props): JSX.Element {

    const openStages = function () {
        eel.open_folder('stages')
    }
    const openSamples = function () {
        eel.open_folder('samples')
    }
    return <>
        <div className="mb-2">
            <button className="btn btn-outline-primary mr-1"
                onClick={openStages}>
                <i className="fal fa-browser"></i> Stages
            </button>
            <button className="btn btn-outline-primary mr-1"
                onClick={openSamples}>
                <i className="fal fa-browser"></i> Samples
            </button>
        </div>
        <Log></Log>
    </>
}