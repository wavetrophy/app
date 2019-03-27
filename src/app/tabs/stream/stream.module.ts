import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StreamPage } from './stream.page';

const routes: Routes = [
  {path: '', component: StreamPage},
  {path: 'location/:id', loadChildren: '../../location/location.module#LocationPageModule'},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [StreamPage],
})
export class StreamPageModule {
}
