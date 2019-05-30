import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewQuestionPage } from './view-question.page';
import { PipeModule } from '../../services/pipes/pipe.module';
import { DirectivesModule } from '../../directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: ViewQuestionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipeModule,
    DirectivesModule,
  ],
  declarations: [ViewQuestionPage]
})
export class ViewQuestionPageModule {}
