import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditEmailPage } from './edit-email.page';

const routes: Routes = [
  {
    path: '',
    component: EditEmailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditEmailPage],
  exports: [EditEmailPage],
})
export class EditEmailPageModule {}
