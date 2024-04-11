export interface BoardData {
    id: number,
    title: string,
}

export interface CardData {
    title: string,
    description: string,
    id: number,
    boardId: number,
  }