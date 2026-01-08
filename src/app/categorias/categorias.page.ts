import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from '../models/task.models';
import { TaskDataService } from '../services/task-data.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: false,
})
export class CategoriasPage implements OnInit {
  categories$!: Observable<Category[]>;
  categoryForm!: FormGroup;
  editingId?: string;

  constructor(private data: TaskDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.categories$ = this.data.categories$;
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#3b82f6', Validators.required],
      icon: ['pricetags-outline', Validators.required],
    });
  }

  startEdit(category: Category): void {
    this.editingId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      color: category.color,
      icon: category.icon,
    });
  }

  resetForm(): void {
    this.editingId = undefined;
    this.categoryForm.reset({
      color: '#3b82f6',
      icon: 'pricetags-outline',
    });
  }

  async saveCategory(): Promise<void> {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    await this.data.upsertCategory({ id: this.editingId, ...this.categoryForm.value });
    this.resetForm();
  }

  async deleteCategory(id: string): Promise<void> {
    await this.data.removeCategory(id);
  }
}

