import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreatePhonenumberPage } from './create-phonenumber.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePhonenumberPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreatePhonenumberPage]
})
export class CreatePhonenumberPageModule {}
