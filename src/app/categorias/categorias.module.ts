import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoriasPageRoutingModule } from './categorias-routing.module';
import { CategoriasPage } from './categorias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CategoriasPageRoutingModule
  ],
  declarations: [CategoriasPage]
})
export class CategoriasPageModule {}

