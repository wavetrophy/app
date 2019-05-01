import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditPhonenumberPage } from './edit-phonenumber.page';

const routes: Routes = [
  {
    path: '',
    component: EditPhonenumberPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditPhonenumberPage]
})
export class EditPhonenumberPageModule {}
