import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, Project, TaskItem } from '../models/task.models';
import { TaskDataService } from '../services/task-data.service';

// Agrupamento preparado para o cartão de projeto (projeto + tarefas + categoria)
interface ProjectCardView {
  project: Project;
  category?: Category;
  tasks: TaskItem[];
}

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  standalone: false,
})
export class ListaPage implements OnInit {
  categories$!: Observable<Category[]>;
  overdue$!: Observable<TaskItem[]>;
  filteredProjects$!: Observable<ProjectCardView[]>;
  filterCategory = 'all';
  projectForm!: FormGroup;
  editingId?: string;

  constructor(
    private data: TaskDataService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      color: [''],
      status: ['new', Validators.required],
    });

    this.categories$ = this.data.categories$;
    this.overdue$ = this.data.getOverdueTasks();
    this.refreshProjects();
  }

  setFilter(categoryId: any): void {
    this.filterCategory = categoryId ?? 'all';
    this.refreshProjects();
  }

  // Combina streams e aplica o filtro de categoria selecionado
  private refreshProjects(): void {
    this.filteredProjects$ = combineLatest([
      this.data.projects$,
      this.data.tasks$,
      this.data.categories$,
    ]).pipe(
      map(([projects, tasks, categories]) => {
        const filtered =
          this.filterCategory === 'all'
            ? projects
            : projects.filter((p) => p.categoryId === this.filterCategory);

        return filtered.map((project) => ({
          project,
          category: categories.find((c) => c.id === project.categoryId),
          tasks: tasks.filter((t) => t.projectId === project.id),
        }));
      }),
    );
  }

  editProject(project: Project): void {
    this.editingId = project.id;
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      categoryId: project.categoryId,
      color: project.color,
      status: project.status,
    });
  }

  resetForm(): void {
    this.editingId = undefined;
    this.projectForm.reset({ status: 'new' });
  }

  async saveProject(): Promise<void> {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    await this.data.upsertProject({
      id: this.editingId,
      ...this.projectForm.value,
      createdAt: new Date().toISOString(),
    });

    this.resetForm();
  }

  async deleteProject(id: string): Promise<void> {
    await this.data.removeProject(id);
  }

  openTasks(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}
