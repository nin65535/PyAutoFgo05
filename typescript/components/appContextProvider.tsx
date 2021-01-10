import * as React from 'react'

type Stage = {
    label: string,
    servants: string[],
    commands: string[][],
}

const initialState = {
    stages: [] as Stage[],
    current_stage: 0 as number,
    current_command: 0 as number,
    current_line: 0 as number,
    log: '' as string,
    page: 0 as number,
}

type State = typeof initialState


/**
 * {
 * 識別名: (state , value) => state
 * ... 
 * }
 */
const reducerSlices = {
    setStages: (state: State, value: Stage[]) =>
        ({ ...state, stages: value, current_stage: 0, current_command: 0, current_line: 0 }) as State,
    setCurrentStage: (state: State, value: number) =>
        ({ ...state, current_stage: value, current_command: 0, current_line: 0 }) as State,
    setCurrentCommand: (state: State, value: number) =>
        ({ ...state, current_command: value, current_line: 0 }) as State,
    setCurrentLine: (state: State, value: number) =>
        ({ ...state, current_line: value }) as State,
    setPos: (state: State, [stage_no, cmd_no, line_no]: number[]) =>
        ({ ...state, current_stage: stage_no, current_command: cmd_no, current_line: line_no }),
    addLog: (state: State, value: string) =>
        ({ ...state, log: state.log + value + "\n" }) as State,
    clearLog: (state: State, value: string) =>
        ({ ...state, log: '' }) as State,
    setPage: (state: State, value: number) =>
        ({ ...state, page: value }) as State
}

type ActionType = keyof typeof reducerSlices
type Action = {
    type: ActionType,
    value: any
}

const myReducer = function (state: State, action: Action): State {
    const func: (s: State, v: any) => State
        = reducerSlices[action.type];
    if (func) {
        return func(state, action.value)
    }
    return state
}

type AppContextType = {
    state: State,
    dispatcher: React.Dispatch<Action>
}

/**
 * 初期化用　即上書きされる
 */
const initialAppContext: AppContextType = {
    state: initialState,
    dispatcher: (() => { })
}


export const AppContext = React.createContext<AppContextType>(initialAppContext)

export const AppContextProvider: React.FC = ({ children }) => {
    const [state, dispatcher] = React.useReducer(myReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatcher }}>
            {children}
        </AppContext.Provider>
    );
};