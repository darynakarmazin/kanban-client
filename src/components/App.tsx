import React, { useState } from "react";

interface BoardItem {
  id: string;
  title: string;
  description?: string;
}

interface Board {
  id: string;
  title: string;
  items: BoardItem[];
}

function App() {
  const [boards, setBoards] = useState<Board[]>([
    {
      id: "1qwe",
      title: "ToDo",
      items: [
        {
          id: "1abc",
          title: "Перша таска",
          description: "Треба зробити це таким чином",
        },
        {
          id: "2abc",
          title: "Інша таска",
          description: "Треба зробити це таким чином",
        },
        {
          id: "3abc",
          title: "Легка таска",
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

    const updatedBoards = boards.map((b) => {
      if (b.id === board.id) {
        const updatedBoard: Board = { ...b };
        const currentIndex = currentBoard.items.indexOf(currentItem);
        const dropIndex = updatedBoard.items.indexOf(item);
        updatedBoard.items.splice(currentIndex, 1);
        updatedBoard.items.splice(dropIndex + 1, 0, currentItem);
        return updatedBoard;
      }
      if (b.id === currentBoard.id) {
        return { ...b, items: currentBoard.items };
      }
      return b;
    });
    setBoards(updatedBoards);
  };

  const dropCardHandler = (e: React.MouseEvent, board: Board) => {
    e.preventDefault();
    if (currentBoard === null || currentItem === null) return;

    board.items.push(currentItem);
    const currentIndex = currentBoard.items.indexOf(currentItem);
    const updatedBoard = { ...currentBoard }; // Define updatedBoard here
    updatedBoard.items.splice(currentIndex, 1);
    setBoards((prevBoards) =>
      prevBoards.map((b) => {
        if (b.id === board.id) {
          return board;
        }
        if (b.id === currentBoard.id) {
          return updatedBoard;
        }
        return b;
      })
    );
    (e.target as HTMLElement).style.boxShadow = "none";
  };

  return (
    <div className="container">
      <input type="text" />
      <ul className="board__list">
        {boards.map((board) => (
          <li key={board.id} className="board__item">
            <h2>{board.title}</h2>
            <div
              className="board"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => dropCardHandler(e, board)}
            >
              <ul>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
