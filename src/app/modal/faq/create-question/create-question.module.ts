import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateQuestionPage } from './create-question.page';
import { DirectivesModule } from '../../../directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: CreateQuestionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule,
  ],
  declarations: [CreateQuestionPage]
})
export class CreateQuestionPageModule {}
