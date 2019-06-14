import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewContactPage } from './view-contact.page';
import { ImageCacheModule } from '../../../services/image-cache';

const routes: Routes = [
  {
    path: '',
    component: ViewContactPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ImageCacheModule,
  ],
  declarations: [ViewContactPage]
})
export class ViewContactPageModule {}
