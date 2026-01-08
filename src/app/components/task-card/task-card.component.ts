import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category, Project, TaskItem } from '../../models/task.models';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: false,
})
export class TaskCardComponent {
  @Input() project!: Project;
  @Input() tasks: TaskItem[] = [];
  @Input() category?: Category;
  @Output() viewTasks = new EventEmitter<string>();
  @Output() editProject = new EventEmitter<Project>();
  @Output() deleteProject = new EventEmitter<string>();

  get completedCount(): number {
    return this.tasks.filter((t) => t.completed).length;
  }

  get overdueCount(): number {
    const now = new Date();
    return this.tasks.filter((t) => !t.completed && new Date(t.dueDate) < now).length;
  }

  onViewTasks(): void {
    this.viewTasks.emit(this.project.id);
  }

  onEdit(): void {
    this.editProject.emit(this.project);
  }

  onDelete(): void {
    this.deleteProject.emit(this.project.id);
  }
}
