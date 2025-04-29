import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// 1. 类型
interface State {
    progress: number;
}

type Action = { type: 'CHANGE'; payload: number };

// 2. 初始值
const initialState: State = {
    progress: 0,
};

// 3. Reducer
function progressReducer(state: State, action: Action): State {
    switch (action.type) {
        case 'CHANGE':
            return { progress: action.payload };
        default:
            return state;
    }
}

// 4. Context
const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

// 5. Provider
export const ProgressProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(progressReducer, initialState);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

// 6. Hooks
export const useProgressState = () => {
    const context = useContext(StateContext);
    if (!context) throw new Error('useState must be used within a Provider');
    return context;
};

export const useProgressDispatch = () => {
    const context = useContext(DispatchContext);
    if (!context) throw new Error('useDispatch must be used within a Provider');
    return context;
};
