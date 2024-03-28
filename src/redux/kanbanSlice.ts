import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, BoardItem, Kanban } from "../types/boardsType";
import { initialKanban } from "../data";

interface KanbanState {
  kanbanData: Kanban | null;
  currentBoard: Board | null;
  currentItem: BoardItem | null;
  boards: Board[];
}

const initialState: KanbanState = {
  kanbanData: null,
  currentBoard: null,
  currentItem: null,
  boards: initialKanban,
};

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    setKanbanData(state, action: PayloadAction<Kanban | null>) {
      state.kanbanData = action.payload;
    },
    setCurrentBoard(state, action: PayloadAction<Board | null>) {
      state.currentBoard = action.payload;
    },
    setCurrentItem(state, action: PayloadAction<BoardItem | null>) {
      state.currentItem = action.payload;
    },
    setBoards(state, action: PayloadAction<Board[] | null>) {
      state.boards = action.payload || [];
    },
  },
});

export const { setKanbanData, setCurrentBoard, setCurrentItem, setBoards } =
  kanbanSlice.actions;

export default kanbanSlice.reducer;
