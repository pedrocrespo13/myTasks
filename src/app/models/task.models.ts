export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Project {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  color?: string;
  status: 'new' | 'active' | 'paused' | 'done';
  createdAt: string;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  updatedAt: string;
}

export interface TaskDataState {
  categories: Category[];
  projects: Project[];
  tasks: TaskItem[];
}

export interface CalendarTask {
  task: TaskItem;
  project: Project;
  category: Category | undefined;
}

