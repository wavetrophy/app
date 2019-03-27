import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocationPage } from './location.page';

const routes: Routes = [
  // TODO remove redirect
  // {path: '', redirectTo: '1', pathMatch: 'full'},
  {
    path: '',
    component: LocationPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LocationPage],
})
export class LocationPageModule {
}
