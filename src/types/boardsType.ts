export interface Kanban {
  id: string;
  hashId: string;
  name: string;
  boards: Board[];
}

export interface BoardItem {
  id: string;
  title: string;
  description?: string;
}

export interface Board {
  id: string;
  title: string;
  items: BoardItem[];
}
