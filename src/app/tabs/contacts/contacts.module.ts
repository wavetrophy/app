import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactsPage } from './contacts.page';
import { ImageCacheModule } from '../../services/image-cache';

const routes: Routes = [
  {
    path: '',
    component: ContactsPage
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
  declarations: [ContactsPage]
})
export class ContactsPageModule {}
