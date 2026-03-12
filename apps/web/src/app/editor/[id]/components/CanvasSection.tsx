"use client";

import type { CanvasElement, CanvasSection as SectionType, Action } from "./useCanvasReducer";
import { TextElement } from "./elements/TextElement";
import { ImageElement } from "./elements/ImageElement";
import { SelectionBox } from "./SelectionBox";

interface CanvasSectionProps {
    section: SectionType;
    elements: CanvasElement[];
    selectedId: string | null;
    editingId: string | null;
    zoom: number;
    dispatch: (action: Action) => void;
    setEditingId: (id: string | null) => void;
    handleDoubleClick: (id: string, type: string) => void;
    onClick: () => void;
}

export function CanvasSection({
    section, elements, selectedId, editingId, zoom, dispatch, setEditingId, handleDoubleClick, onClick
}: CanvasSectionProps) {
    const scale = zoom / 100;
    const sectionH = section.height * scale;

    const selectedEl = elements.find(e => e.id === selectedId) ?? null;
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    return (
        <div
            onClick={onClick}
            style={{
                position: "relative",
                width: "100%", // 100% of the parent Canvas width
                height: sectionH,
                overflow: "hidden", // clip elements inside this section
                flexShrink: 0,
            }}
        >
            {/* Element render */}
            {sorted.map(el => {
                if (el.type === "text") {
                    return (
                        <TextElement
                            key={el.id}
                            element={el}
                            zoom={zoom}
                            isSelected={el.id === selectedId}
                            isEditing={el.id === editingId}
                            onSelect={() => dispatch({ type: "SELECT", id: el.id })}
                            onDoubleClick={() => handleDoubleClick(el.id, "text")}
                            onFinishEditing={() => setEditingId(null)}
                            onUpdateText={(id, text) => dispatch({
                                type: "UPDATE_ELEMENT", id,
                                changes: { props: { ...el.props, text } },
                            })}
                            onUpdateProps={(id, changes) => dispatch({ type: "UPDATE_ELEMENT", id, changes })}
                        />
                    );
                }
                if (el.type === "image") {
                    return (
                        <ImageElement
                            key={el.id}
                            element={el}
                            zoom={zoom}
                            isSelected={el.id === selectedId}
                            onSelect={() => dispatch({ type: "SELECT", id: el.id })}
                        />
                    );
                }
                return null;
            })}

            {/* Selection overlay — hidden while text is being inline-edited */}
            {selectedEl && !editingId && (
                <SelectionBox
                    element={selectedEl}
                    zoom={zoom}
                    onMove={(id, x, y) => dispatch({ type: "MOVE", id, x, y, sectionId: section.id })}
                    onResize={(id, x, y, w, h) => dispatch({ type: "RESIZE", id, x, y, width: w, height: h })}
                    onDelete={(id) => dispatch({ type: "DELETE_ELEMENT", id })}
                    onDuplicate={(id) => dispatch({ type: "DUPLICATE", id })}
                    onBringForward={(id) => dispatch({ type: "BRING_FORWARD", id })}
                    onSendBackward={(id) => dispatch({ type: "SEND_BACKWARD", id })}
                    onDoubleClick={() => handleDoubleClick(selectedEl.id, selectedEl.type)}
                />
            )}
        </div>
    );
}
