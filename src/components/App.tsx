import React, { useState } from "react";
import { Board, BoardItem } from "../types/boardsType";

function App() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "1qwe",
      title: "ToDo",
      items: [
        {
          id: "1abc",
          title: "1 - Перша таска",
          description: "Треба зробити це таким чином",
        },
        {
          id: "2abc",
          title: "2 - Інша таска",
          description: "Треба зробити це таким чином",
        },
        {
          id: "3abc",
          title: "3 - Легка таска",
          description: "Треба зробити це таким чином",
        },
      ],
    },
    { id: "2qwe", title: "In Progress", items: [] },
    { id: "3qwe", title: "Done", items: [] },
  ]);
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [currentItem, setCurrentItem] = useState<BoardItem | null>(null);

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
      <input type="text" />
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
