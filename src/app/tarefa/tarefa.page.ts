import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Project, TaskItem } from '../models/task.models';
import { TaskDataService } from '../services/task-data.service';

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.page.html',
  styleUrls: ['./tarefa.page.scss'],
  standalone: false,
})
export class TarefaPage implements OnInit {
  projectId!: string;
  project?: Project;
  category?: Category;
  tasks$!: Observable<TaskItem[]>;
  taskForm!: FormGroup;
  editingTaskId?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private data: TaskDataService,
  ) {}

  ngOnInit(): void {
    this.projectId = String(this.route.snapshot.paramMap.get('projectId'));
    this.project = this.data.findProject(this.projectId);
    this.category = this.project ? this.data.findCategory(this.project.categoryId) : undefined;

    // Stream ordenada por data para alimentar a lista
    this.tasks$ = this.data.getTasksByProject(this.projectId).pipe(
      map((tasks) => tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())),
    );

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [new Date().toISOString(), Validators.required],
      priority: ['medium', Validators.required],
      completed: [false],
    });
  }

  isOverdue(task: TaskItem): boolean {
    return !task.completed && new Date(task.dueDate) < new Date();
  }

  startEdit(task: TaskItem): void {
    this.editingTaskId = task.id;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      completed: task.completed,
    });
  }

  resetForm(): void {
    this.editingTaskId = undefined;
    this.taskForm.reset({
      dueDate: new Date().toISOString(),
      priority: 'medium',
      completed: false,
    });
  }

  async saveTask(): Promise<void> {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    await this.data.upsertTask({
      id: this.editingTaskId,
      projectId: this.projectId,
      ...this.taskForm.value,
    });
    this.resetForm();
  }

  async toggleTask(taskId: string): Promise<void> {
    await this.data.toggleTask(taskId);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.data.removeTask(taskId);
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
