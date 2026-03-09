"use client";

import { useReducer, useCallback } from "react";

// ── Types ──
export type ElementType = "text" | "image" | "sticker" | "shape";

export interface TextProps {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    textAlign: "left" | "center" | "right";
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    lineHeight: number;
}

export interface ImageProps {
    src: string;
    objectFit: "cover" | "contain";
    borderRadius: number;
    opacity: number;
}

export interface CanvasElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    zIndex: number;
    locked: boolean;
    props: Partial<TextProps & ImageProps>;
}

export interface CanvasState {
    width: number;
    height: number;
    background: string;
    elements: CanvasElement[];
    selectedId: string | null;
    zoom: number;
    past: CanvasElement[][];
    future: CanvasElement[][];
}

const MAX_HISTORY = 50;

// ── Actions ──
export type Action =
    | { type: "ADD_ELEMENT"; element: CanvasElement }
    | { type: "UPDATE_ELEMENT"; id: string; changes: Partial<CanvasElement> }
    | { type: "DELETE_ELEMENT"; id: string }
    | { type: "SELECT"; id: string | null }
    | { type: "MOVE"; id: string; x: number; y: number }
    | { type: "RESIZE"; id: string; x: number; y: number; width: number; height: number }
    | { type: "SET_BACKGROUND"; background: string }
    | { type: "SET_ZOOM"; zoom: number }
    | { type: "UNDO" }
    | { type: "REDO" }
    | { type: "LOAD"; elements: CanvasElement[]; background: string }
    | { type: "BRING_FORWARD"; id: string }
    | { type: "SEND_BACKWARD"; id: string }
    | { type: "DUPLICATE"; id: string };

function snapshot(elements: CanvasElement[]): CanvasElement[] {
    return JSON.parse(JSON.stringify(elements));
}

function withHistory(state: CanvasState, newElements: CanvasElement[]): CanvasState {
    const past = [...state.past, snapshot(state.elements)].slice(-MAX_HISTORY);
    return { ...state, elements: newElements, past, future: [] };
}

export function canvasReducer(state: CanvasState, action: Action): CanvasState {
    switch (action.type) {
        case "ADD_ELEMENT": {
            const maxZ = state.elements.reduce((m, e) => Math.max(m, e.zIndex), 0);
            const el = { ...action.element, zIndex: maxZ + 1 };
            return withHistory(state, [...state.elements, el]);
        }
        case "UPDATE_ELEMENT": {
            const updated = state.elements.map(e =>
                e.id === action.id ? { ...e, ...action.changes } : e
            );
            return withHistory(state, updated);
        }
        case "DELETE_ELEMENT": {
            const filtered = state.elements.filter(e => e.id !== action.id);
            return { ...withHistory(state, filtered), selectedId: null };
        }
        case "SELECT":
            return { ...state, selectedId: action.id };
        case "MOVE": {
            const moved = state.elements.map(e =>
                e.id === action.id ? { ...e, x: action.x, y: action.y } : e
            );
            return { ...state, elements: moved }; // no history on drag (too noisy)
        }
        case "RESIZE": {
            const resized = state.elements.map(e =>
                e.id === action.id ? { ...e, x: action.x, y: action.y, width: action.width, height: action.height } : e
            );
            return withHistory(state, resized);
        }
        case "SET_BACKGROUND":
            return { ...withHistory(state, state.elements), background: action.background };
        case "SET_ZOOM":
            return { ...state, zoom: action.zoom };
        case "LOAD":
            return { ...state, elements: action.elements, background: action.background, past: [], future: [], selectedId: null };
        case "BRING_FORWARD": {
            const el = state.elements.find(e => e.id === action.id);
            if (!el) return state;
            const above = state.elements.filter(e => e.zIndex > el.zIndex);
            const nextZ = above.length > 0 ? Math.min(...above.map(e => e.zIndex)) + 1 : el.zIndex + 1;
            const updated = state.elements.map(e =>
                e.id === action.id ? { ...e, zIndex: nextZ } : (e.zIndex === nextZ - 1 ? { ...e, zIndex: el.zIndex } : e)
            );
            return withHistory(state, updated);
        }
        case "SEND_BACKWARD": {
            const el = state.elements.find(e => e.id === action.id);
            if (!el) return state;
            const newZ = Math.max(1, el.zIndex - 1);
            const updated = state.elements.map(e =>
                e.id === action.id ? { ...e, zIndex: newZ } : (e.zIndex === newZ ? { ...e, zIndex: el.zIndex } : e)
            );
            return withHistory(state, updated);
        }
        case "DUPLICATE": {
            const el = state.elements.find(e => e.id === action.id);
            if (!el) return state;
            const dup: CanvasElement = { ...JSON.parse(JSON.stringify(el)), id: `el-${Date.now()}`, x: el.x + 20, y: el.y + 20 };
            return withHistory(state, [...state.elements, dup]);
        }
        case "UNDO": {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, -1);
            return { ...state, elements: previous, past: newPast, future: [snapshot(state.elements), ...state.future].slice(0, MAX_HISTORY) };
        }
        case "REDO": {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            const newFuture = state.future.slice(1);
            return { ...state, elements: next, past: [...state.past, snapshot(state.elements)], future: newFuture };
        }
        default:
            return state;
    }
}

export const initialCanvasState: CanvasState = {
    width: 390,
    height: 844,
    background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 30%, #fff 100%)",
    elements: [],
    selectedId: null,
    zoom: 75,
    past: [],
    future: [],
};

// ── Hook ──
export function useCanvasReducer(initial?: Partial<CanvasState>) {
    const [state, dispatch] = useReducer(canvasReducer, { ...initialCanvasState, ...initial });

    const addText = useCallback((text = "Nhấn để chỉnh sửa", x = 50, y = 100) => {
        dispatch({
            type: "ADD_ELEMENT",
            element: {
                id: `el-${Date.now()}`,
                type: "text",
                x, y, width: 290, height: 60,
                rotation: 0, opacity: 1, zIndex: 1, locked: false,
                props: {
                    text, fontSize: 24,
                    fontFamily: "'Dancing Script', cursive",
                    color: "#831843", textAlign: "center",
                    fontWeight: "normal", fontStyle: "normal", lineHeight: 1.4,
                },
            },
        });
    }, []);

    const addImage = useCallback((src: string, x = 20, y = 200) => {
        dispatch({
            type: "ADD_ELEMENT",
            element: {
                id: `el-${Date.now()}`,
                type: "image",
                x, y, width: 350, height: 280,
                rotation: 0, opacity: 1, zIndex: 1, locked: false,
                props: { src, objectFit: "cover", borderRadius: 12, opacity: 1 },
            },
        });
    }, []);

    return { state, dispatch, addText, addImage };
}
