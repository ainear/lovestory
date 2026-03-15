"use client";
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type Dispatch,
} from "react";
import type { EditorState, EditorAction, CanvasElement } from "./types";

const MAX_UNDO = 50;

const initialState: EditorState = {
  elements: [],
  canvasWidth: 500,
  canvasHeight: 7300,
  canvasBackground: "#f8f3eb",
  selectedId: null,
  multiSelectIds: [],
  zoom: 1,
  undoStack: [],
  redoStack: [],
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_ELEMENTS":
      return { ...state, elements: action.elements };

    case "SELECT":
      return { ...state, selectedId: action.id, multiSelectIds: [] };

    case "MULTI_SELECT":
      return { ...state, multiSelectIds: action.ids, selectedId: null };

    case "UPDATE_ELEMENT": {
      const elements = state.elements.map((el) =>
        el.id === action.id ? { ...el, ...action.patch } : el,
      );
      return { ...state, elements };
    }

    case "UPDATE_PROPS": {
      const elements = state.elements.map((el) =>
        el.id === action.id
          ? { ...el, props: { ...el.props, ...action.props } }
          : el,
      );
      return { ...state, elements };
    }

    case "ADD_ELEMENT":
      return {
        ...state,
        elements: [...state.elements, action.element],
        selectedId: action.element.id,
      };

    case "DELETE_ELEMENT": {
      const elements = state.elements.filter((el) => el.id !== action.id);
      const selectedId =
        state.selectedId === action.id ? null : state.selectedId;
      return { ...state, elements, selectedId };
    }

    case "REORDER": {
      const idx = state.elements.findIndex((el) => el.id === action.id);
      if (idx === -1) return state;
      const maxZ = Math.max(...state.elements.map((el) => el.zIndex), 0);
      const minZ = Math.min(...state.elements.map((el) => el.zIndex), 0);
      const el = state.elements[idx];

      let newZ = el.zIndex;
      if (action.direction === "front") newZ = maxZ + 1;
      else if (action.direction === "back") newZ = minZ - 1;
      else if (action.direction === "up") newZ = el.zIndex + 1;
      else if (action.direction === "down") newZ = el.zIndex - 1;

      const elements = state.elements.map((e) =>
        e.id === action.id ? { ...e, zIndex: newZ } : e,
      );
      return { ...state, elements };
    }

    case "SNAPSHOT": {
      const undoStack = [...state.undoStack, state.elements].slice(-MAX_UNDO);
      return { ...state, undoStack, redoStack: [] };
    }

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const undoStack = [...state.undoStack];
      const prev = undoStack.pop()!;
      return {
        ...state,
        elements: prev,
        undoStack,
        redoStack: [...state.redoStack, state.elements],
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const redoStack = [...state.redoStack];
      const next = redoStack.pop()!;
      return {
        ...state,
        elements: next,
        redoStack,
        undoStack: [...state.undoStack, state.elements],
      };
    }

    case "SET_CANVAS":
      return {
        ...state,
        canvasWidth: action.width,
        canvasHeight: action.height,
        canvasBackground: action.background,
      };

    case "SET_ZOOM":
      return { ...state, zoom: action.zoom };

    default:
      return state;
  }
}

// Context
interface EditorContextValue {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  selectedElement: CanvasElement | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditorContext() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditorContext must be inside EditorProvider");
  return ctx;
}

export { EditorContext, editorReducer, initialState };
