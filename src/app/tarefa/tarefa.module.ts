import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TarefaPageRoutingModule } from './tarefa-routing.module';
import { TarefaPage } from './tarefa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TarefaPageRoutingModule
  ],
  declarations: [TarefaPage]
})
export class TarefaPageModule {}
