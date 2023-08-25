import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function DragAndDropList({ items }) {
    const onDragEnd = (result) => {
        // ドラッグ＆ドロップが完了した際の処理
        if (!result.destination) {
            return;
        }

        // ドラッグ元とドロップ先のインデックスを取得して行の並び替えを行う
        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        // 並び替えた行のリストを更新
        // (ここでStateを更新するか、親コンポーネントにイベントを通知するなどの方法があります)
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {items.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                            >
                                {(provided) => (
                                    <li style={{padding: "20px"}}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >
                                        {item.content}
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default DragAndDropList;
