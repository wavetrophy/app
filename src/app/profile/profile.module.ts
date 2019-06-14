import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { DirectivesModule } from '../directives/directives.module';
import { ImageCacheModule } from '../services/image-cache';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProfilePage,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    ImageCacheModule,
  ],
  declarations: [ProfilePage],
})
export class ProfilePageModule {
}
