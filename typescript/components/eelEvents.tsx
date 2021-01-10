import * as React from 'react'
import { eel } from '../eel.js'

//eel関係の受信はdocumentのEventとして処理する
const eelEventTypes = {
    EEL_LOG: 'eel-log',
    EEL_SET_POS: 'eel-set-pos',
    EEL_PLAY_END: 'eel-play-end',
}
//値からtypeを生成するスタイル
type EelEventTypes = keyof typeof eelEventTypes
export const { EEL_LOG, EEL_SET_POS, EEL_PLAY_END } = eelEventTypes as { [key: string]: EelEventTypes }

eel.expose(log)
function log(msg: string): void {
    const event = new CustomEvent(EEL_LOG, { detail: msg });
    document.dispatchEvent(event);
}

eel.expose(set_pos)
function set_pos(stage_no: number, cmd_no: number, line_no: number): void {
    const event = new CustomEvent(EEL_SET_POS, { detail: [stage_no, cmd_no, line_no] });
    document.dispatchEvent(event);
}

eel.expose(play_end)
function play_end(stage_no: number, cmd_no: number): void {
    const event = new CustomEvent(EEL_PLAY_END, { detail: [stage_no, cmd_no] });
    document.dispatchEvent(event)
}

/*
コンポーネント生成時にイベントリスナを仕込み
破棄時にリスナを解除する処理
*/
export function useEelEvent(event: EelEventTypes, listener: (customEvent: CustomEvent) => void) {
    React.useEffect(() => {
        document.addEventListener(event, listener)
        return () => {
            document.removeEventListener(event, listener)
        }
    })
}