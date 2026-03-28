export interface Card {
  id: string;
  boardId: string;
  column: string;
  title: string;
  description?: string;
  assigneeUserId?: string;
  labels?: string[];
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
