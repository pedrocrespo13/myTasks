import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./lista/lista.module').then((m) => m.ListaPageModule),
  },
  {
    path: 'projects/:projectId',
    loadChildren: () =>
      import('./tarefa/tarefa.module').then((m) => m.TarefaPageModule),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./categorias/categorias.module').then(
        (m) => m.CategoriasPageModule,
      ),
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('./calendario/calendario.module').then(
        (m) => m.CalendarioPageModule,
      ),
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
