export interface BoardAnalytics {
  boardId: string;
  boardName: string;
  totalCards: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  completionRate: number;
}
