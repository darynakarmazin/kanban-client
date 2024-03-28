import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setKanbanData,
  setCurrentBoard,
  setCurrentItem,
  setBoards,
} from "../redux/kanbanSlice";
import { RootState } from "../redux/store";
import { Board, BoardItem } from "../types/boardsType";
import { kanban } from "../data";

function App() {
  const dispatch = useDispatch();
  const kanbanData = useSelector((state: RootState) => state.kanban.kanbanData);
  const boards = useSelector((state: RootState) => state.kanban.boards);
  const currentBoard = useSelector(
    (state: RootState) => state.kanban.currentBoard
  );
  const currentItem = useSelector(
    (state: RootState) => state.kanban.currentItem
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [kanbanId, setKanbanId] = useState("");

  const handleBoardIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKanbanId(e.target.value);
  };

  const handleLoadButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (kanbanId.trim() !== "") {
      const newBoard = getBoardById(kanbanId);
      if (newBoard) {
        setKanbanId("");
        dispatch(setCurrentBoard(null));
        dispatch(setCurrentItem(null));
        dispatch(setBoards(newBoard.boards));
        dispatch(setKanbanData(newBoard));
        formRef.current?.reset();
      } else {
        alert("Board not found!");
      }
    }
  };

  function getBoardById(targetId: string) {
    const kanbanItem = kanban.find((item) => item.hashId === targetId);
    return kanbanItem;
  }

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if ((e.target as HTMLElement).className === "item") {
      (e.target as HTMLElement).style.boxShadow = "0 4px 3px gray";
    }
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  const dragStartHandler = (
    e: React.DragEvent,
    board: Board,
    item: BoardItem
  ) => {
    dispatch(setCurrentBoard(board));
    dispatch(setCurrentItem(item));
  };

  const dragEndHandler = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  const dropHandler = (
    e: React.MouseEvent,
    board: Board,
    droppedItem: BoardItem
  ) => {
    e.preventDefault();
    if (!currentBoard || !currentItem) return;

    const currentIndex = currentBoard.items.indexOf(currentItem);
    if (currentIndex !== -1) {
      const updatedCurrentBoard = {
        ...currentBoard,
        items: currentBoard.items.filter((item) => item.id !== currentItem.id),
      };
      dispatch(
        setBoards(
          boards.map((b) =>
            b.id === currentBoard.id ? updatedCurrentBoard : b
          )
        )
      );
    }

    const dropIndex = board.items.indexOf(droppedItem);
    board.items.splice(dropIndex + 1, 0, currentItem);

    dispatch(
      setBoards(
        boards.map((b) => {
          if (b.id === board.id) {
            return board;
          }
          return b;
        })
      )
    );

    // Додайте поточний елемент на нове місце
    dispatch(
      setBoards(
        boards.map((b) => {
          if (b.id === board.id) {
            return {
              ...b,
              items: [
                ...b.items.slice(0, dropIndex + 1),
                currentItem,
                ...b.items.slice(dropIndex + 1),
              ],
            };
          }
          return b;
        })
      )
    );

    (e.target as HTMLElement).style.boxShadow = "none";
  };

  const dropCardHandler = (e: React.MouseEvent, board: Board) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentBoard || !currentItem) return;

    const updatedTargetBoard = {
      ...board,
      items: [...board.items, currentItem],
    };

    const updatedCurrentBoard = {
      ...currentBoard,
      items: currentBoard.items.filter((item) => item.id !== currentItem.id),
    };

    dispatch(
      setBoards(
        boards.map((b) => {
          if (b.id === updatedTargetBoard.id) {
            return updatedTargetBoard;
          }
          if (b.id === updatedCurrentBoard.id) {
            return updatedCurrentBoard;
          }
          return b;
        })
      )
    );

    (e.target as HTMLElement).style.boxShadow = "none";
  };

  const handleAddCard = (board: Board) => {
    const title = prompt("Enter title for the new card:");
    const description = prompt("Enter description for the new card:");

    if (title && description) {
      const newCard: BoardItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: title,
        description: description,
      };

      dispatch(
        setBoards(
          boards.map((b) =>
            b.id === board.id ? { ...b, items: [...b.items, newCard] } : b
          )
        )
      );
    }
  };

  return (
    <div className="container">
      <form
        onSubmit={handleLoadButtonClick}
        className="search-form"
        ref={formRef}
      >
        <input
          onChange={handleBoardIdInputChange}
          value={kanbanId}
          className="search-input"
          type="text"
          placeholder="Enter a board ID here..."
        />
        <button className="search-btn" type="submit">
          Load
        </button>
      </form>

      <div className="kanban-menu">
        <div className="kanban-buttons">
          <button type="button" className="kanban-btn">
            Create new board
          </button>
          <button type="button" className="kanban-btn">
            Delete board
          </button>
        </div>
        {kanbanData && (
          <div className="kanban-data">
            <h1>{`Kanban board name: ${kanbanData?.name}`}</h1>
            <p>{`Kanban board id: ${kanbanData?.hashId}`}</p>
          </div>
        )}
      </div>

      <ul className="board-list">
        {boards.map((board) => (
          <li key={board.id} className="board-item">
            <h2 className="board-title">{board.title}</h2>
            <div
              className="board-content"
              onDragOver={(e) => dragOverHandler(e)}
              onDropCapture={(e) => dropCardHandler(e, board)}
            >
              <ul className="item-list">
                {board.items?.map((item) => (
                  <li
                    key={item.id}
                    className="item"
                    draggable={true}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDragStart={(e) => dragStartHandler(e, board, item)}
                    onDragEnd={(e) => dragEndHandler(e)}
                    onDrop={(e) => dropHandler(e, board, item)}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
              {board.title === "ToDo" && (
                <div className="add-card" onClick={() => handleAddCard(board)}>
                  +
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
