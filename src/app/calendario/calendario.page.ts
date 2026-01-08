import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CalendarTask } from '../models/task.models';
import { TaskDataService } from '../services/task-data.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: false,
})
export class CalendarioPage implements OnInit {
  selectedDate = new Date().toISOString();
  calendarTasks$!: Observable<CalendarTask[]>;
  editForm!: FormGroup;
  editingTask?: CalendarTask;

  constructor(private data: TaskDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['medium', Validators.required],
      completed: [false],
    });
    this.refresh();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.detail.value;
    this.refresh();
  }

  // Regenera a lista quando a data muda ou após editar
  refresh(): void {
    this.calendarTasks$ = this.data.getCalendarTasks(this.selectedDate);
  }

  openEdit(entry: CalendarTask): void {
    this.editingTask = entry;
    this.editForm.patchValue({
      title: entry.task.title,
      description: entry.task.description,
      dueDate: entry.task.dueDate,
      priority: entry.task.priority,
      completed: entry.task.completed,
    });
  }

  cancelEdit(): void {
    this.editingTask = undefined;
    this.editForm.reset({
      priority: 'medium',
      completed: false,
      dueDate: this.selectedDate,
    });
  }

  async saveEdit(): Promise<void> {
    if (!this.editingTask || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    await this.data.upsertTask({
      id: this.editingTask.task.id,
      projectId: this.editingTask.task.projectId,
      ...this.editForm.value,
    });
    this.cancelEdit();
    this.refresh();
  }
}

