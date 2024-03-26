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
