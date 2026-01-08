import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { seedData } from '../data/seed-data';
import {
  CalendarTask,
  Category,
  Project,
  TaskDataState,
  TaskItem,
} from '../models/task.models';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'task-data';

/**
 * Serviço central de negócio: gere categorias, projetos e tarefas,
 * faz persistência no Ionic Storage e disponibiliza streams para UI.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskDataService {
  private state$ = new BehaviorSubject<TaskDataState>(seedData);
  readonly categories$ = this.state$.pipe(map((data) => data.categories));
  readonly projects$ = this.state$.pipe(map((data) => data.projects));
  readonly tasks$ = this.state$.pipe(map((data) => data.tasks));

  constructor(private storage: StorageService) {
    this.restore();
  }

  private async restore(): Promise<void> {
    const stored = await this.storage.get<TaskDataState>(STORAGE_KEY, seedData);
    this.state$.next(stored);
  }

  private async persist(nextState: TaskDataState): Promise<void> {
    this.state$.next(nextState);
    await this.storage.set(STORAGE_KEY, nextState);
  }

  private generateId(prefix: string): string {
    const rnd = Math.random().toString(36).slice(2, 6);
    return `${prefix}-${Date.now().toString(36)}-${rnd}`;
  }

  // ----------------- Categorias -----------------
  async upsertCategory(input: Partial<Category>): Promise<Category> {
    const current = this.state$.value;
    const exists = input.id
      ? current.categories.find((c) => c.id === input.id)
      : undefined;
    const category: Category = {
      id: exists?.id ?? this.generateId('cat'),
      name: input.name ?? exists?.name ?? 'Nova categoria',
      color: input.color ?? exists?.color ?? '#64748b',
      icon: input.icon ?? exists?.icon ?? 'albums-outline',
    };

    const categories = exists
      ? current.categories.map((c) => (c.id === category.id ? category : c))
      : [...current.categories, category];

    await this.persist({ ...current, categories });
    return category;
  }

  async removeCategory(id: string): Promise<void> {
    const current = this.state$.value;
    const projects = current.projects.filter((p) => p.categoryId !== id);
    const projectIds = projects.map((p) => p.id);
    const tasks = current.tasks.filter((t) => projectIds.includes(t.projectId));
    const categories = current.categories.filter((c) => c.id !== id);
    await this.persist({ categories, projects, tasks });
  }

  // ----------------- Projetos -----------------
  async upsertProject(input: Partial<Project>): Promise<Project> {
    const current = this.state$.value;
    const existing = input.id
      ? current.projects.find((p) => p.id === input.id)
      : undefined;

    const project: Project = {
      id: existing?.id ?? this.generateId('proj'),
      categoryId: input.categoryId ?? existing?.categoryId ?? '',
      name: input.name ?? existing?.name ?? 'Novo projeto',
      description: input.description ?? existing?.description ?? '',
      color: input.color ?? existing?.color ?? '#0ea5e9',
      status: input.status ?? existing?.status ?? 'new',
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };

    const projects = existing
      ? current.projects.map((p) => (p.id === project.id ? project : p))
      : [...current.projects, project];

    await this.persist({ ...current, projects });
    return project;
  }

  async removeProject(id: string): Promise<void> {
    const current = this.state$.value;
    const projects = current.projects.filter((p) => p.id !== id);
    const tasks = current.tasks.filter((t) => t.projectId !== id);
    await this.persist({ ...current, projects, tasks });
  }

  // ----------------- Tarefas -----------------
  async upsertTask(input: Partial<TaskItem>): Promise<TaskItem> {
    const current = this.state$.value;
    const existing = input.id
      ? current.tasks.find((t) => t.id === input.id)
      : undefined;

    const task: TaskItem = {
      id: existing?.id ?? this.generateId('task'),
      projectId: input.projectId ?? existing?.projectId ?? '',
      title: input.title ?? existing?.title ?? 'Nova tarefa',
      description: input.description ?? existing?.description ?? '',
      dueDate: input.dueDate ?? existing?.dueDate ?? new Date().toISOString(),
      completed: input.completed ?? existing?.completed ?? false,
      priority: input.priority ?? existing?.priority ?? 'medium',
      updatedAt: new Date().toISOString(),
    };

    const tasks = existing
      ? current.tasks.map((t) => (t.id === task.id ? task : t))
      : [...current.tasks, task];

    await this.persist({ ...current, tasks });
    return task;
  }

  async toggleTask(taskId: string): Promise<void> {
    const current = this.state$.value;
    const tasks = current.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t,
    );
    await this.persist({ ...current, tasks });
  }

  async removeTask(id: string): Promise<void> {
    const current = this.state$.value;
    const tasks = current.tasks.filter((t) => t.id !== id);
    await this.persist({ ...current, tasks });
  }

  // ----------------- Queries -----------------
  getProjectsByCategory(categoryId?: string) {
    return this.projects$.pipe(
      map((projects) =>
        categoryId && categoryId !== 'all'
          ? projects.filter((p) => p.categoryId === categoryId)
          : projects,
      ),
    );
  }

  getTasksByProject(projectId: string) {
    return this.tasks$.pipe(map((tasks) => tasks.filter((t) => t.projectId === projectId)));
  }

  getOverdueTasks() {
    const now = new Date();
    return this.tasks$.pipe(
      map((tasks) => tasks.filter((t) => !t.completed && new Date(t.dueDate) < now)),
    );
  }

  getCalendarTasks(dateISO: string) {
    const target = new Date(dateISO).toDateString();
    return this.state$.pipe(
      map((state) => {
        const matches = state.tasks.filter(
          (t) => new Date(t.dueDate).toDateString() === target,
        );
        return matches.map<CalendarTask>((task) => ({
          task,
          project: state.projects.find((p) => p.id === task.projectId)!,
          category: state.categories.find(
            (c) => c.id === state.projects.find((p) => p.id === task.projectId)?.categoryId,
          ),
        }));
      }),
    );
  }

  findProject(projectId: string): Project | undefined {
    return this.state$.value.projects.find((p) => p.id === projectId);
  }

  findTask(taskId: string): TaskItem | undefined {
    return this.state$.value.tasks.find((t) => t.id === taskId);
  }

  findCategory(categoryId: string): Category | undefined {
    return this.state$.value.categories.find((c) => c.id === categoryId);
  }
}

