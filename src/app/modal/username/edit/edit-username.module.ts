import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditUsernamePage } from './edit-username.page';

const routes: Routes = [
  {
    path: '',
    component: EditUsernamePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditUsernamePage],
  exports: [EditUsernamePage],
})
export class EditUsernamePageModule {}
