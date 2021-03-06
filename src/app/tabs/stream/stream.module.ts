import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StreamPage } from './stream.page';
import { DirectivesModule } from '../../directives/directives.module';

const routes: Routes = [
  {path: '', component: StreamPage},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule,
  ],
  declarations: [StreamPage],
})
export class StreamPageModule {
}
