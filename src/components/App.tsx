import React, { useRef, useState } from "react";
import { Board, BoardItem, Kanban } from "../types/boardsType";
import { kanban } from "../data";

function App() {
  const [kanbanData, setKanbanData] = useState<Kanban | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [currentItem, setCurrentItem] = useState<BoardItem | null>(null);

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
        setCurrentBoard(null);
        setCurrentBoard(null);
        setBoards(newBoard.boards);
        setKanbanData(newBoard);
        formRef.current?.reset();
      } else {
        alert("Board not found!");
      }
    }
  };

  function getBoardById(hachId: string) {
    const kanbanItem = kanban.find((item) => item.id === hachId);
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
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  const dragEndHandler = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  const dropHandler = (e: React.MouseEvent, board: Board, item: BoardItem) => {
    e.preventDefault();
    if (currentBoard === null || currentItem === null) return;
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);
    const dropIndex = board.items.indexOf(item);
    board.items.splice(dropIndex + 1, 0, currentItem);

    setBoards(
      boards.map((b) => {
        if (b.id === board.id) {
          return board;
        }
        if (b.id === currentBoard.id) {
          return currentBoard;
        }
        return b;
      })
    );
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  const dropCardHandler = (e: React.MouseEvent, board: Board) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentBoard === null || currentItem === null) return;
    board.items.push(currentItem);
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);

    setBoards(
      boards.map((b) => {
        if (b.id === board.id) {
          return board;
        }
        if (b.id === currentBoard.id) {
          return currentBoard;
        }
        return b;
      })
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

      setBoards(
        boards.map((b) => {
          if (b.id === board.id) {
            return {
              ...b,
              items: [...b.items, newCard],
            };
          }
          return b;
        })
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

      <div className="kanban-data">
        <h1>{`Kanban board name: ${kanbanData?.name}`}</h1>
        <p>{`Kanban board id: ${kanbanData?.id}`}</p>
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
