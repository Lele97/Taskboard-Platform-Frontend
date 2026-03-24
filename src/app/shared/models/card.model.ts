export interface Card {
  id: string;
  boardId: string;
  column: string; // "TODO" | "IN_PROGRESS" | "DONE" ecc.
  title: string;
  description?: string;
  assigneeUserId?: string;
  labels?: string[];
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
