import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./Input.module.css"

export default function ListMover({ label, items: initialItems = [], onReorder}) {
    const [items, setItems] = useState(initialItems)

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    // Atualiza os itens internos se as props mudarem
    useEffect(() => {
        setItems(initialItems);
    }, [initialItems])

    const handleOnDragEnd = (result) => {
    if (!result.destination) return; // saiu da lista

    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);

    if (onReorder) onReorder(reordered)
    };

    return (
            <div className={styles.containerlist}>
                <label className={styles.label}>{label}</label>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="droppable-list">
                    {(provided) => (
                    <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`${styles.listItem} ${
                                                snapshot.isDragging ? styles.dragging : ""
                                            }`}
                                            style={{
                                                ...provided.draggableProps.style,
                                                // Adiciona transição suave
                                                transition: snapshot.isDragging ? 'none' : 'all 0.2s ease'
                                            }}
                                        >
                                            <div>{item.content}</div>
                                        </li>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                    )}
                </Droppable>
                </DragDropContext>
            </div>
    )
}