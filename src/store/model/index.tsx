import React, { createContext, useReducer, useContext, ReactNode } from "react";

type State = {
    model: any;
    scene: any;
    activeFloor: string;
    lightMaps: any;
    floorMaterial: any;
    wallMaterial: any;
    doorMaterial: any;
};

type Action =
    | { type: "SET_MODEL"; payload: any }
    | { type: "SET_SCENE"; payload: any }
    | { type: "SET_LIGHTMAPS"; payload: any }
    | { type: "SET_ACTIVE_FLOOR"; payload: string }
    | { type: "SET_FLOOR_MATERIAL"; payload: any }
    | { type: "SET_WALL_MATERIAL"; payload: any }
    | { type: "SET_DOOR_MATERIAL"; payload: any };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_MODEL":
            return { ...state, model: action.payload };
        case "SET_SCENE":
            return { ...state, scene: action.payload };
        case "SET_LIGHTMAPS":
            return { ...state, lightMaps: action.payload };
        case "SET_ACTIVE_FLOOR":
            return { ...state, activeFloor: action.payload };
        case "SET_FLOOR_MATERIAL":
            return { ...state, floorMaterial: action.payload };
        case "SET_WALL_MATERIAL":
            return { ...state, wallMaterial: action.payload };
        case "SET_DOOR_MATERIAL":
            return { ...state, doorMaterial: action.payload };
        default:
            return state;
    }
};


const initialState: State = {
    model: null,
    scene: null,
    activeFloor: "Safe_Area",
    lightMaps: null,
    floorMaterial: null,
    wallMaterial: null,
    doorMaterial: null,
};

const ModelContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | null>(null);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <ModelContext.Provider value={{ state, dispatch }}>
            {children}
        </ModelContext.Provider>
    );
};

export const useModel = () => {
    const context = useContext(ModelContext);
    if (!context) throw new Error("useModel must be used within a ModelProvider");
    return context;
};

