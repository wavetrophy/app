import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChooseTeamPage } from './choose-team.page';
import { DirectivesModule } from '../../../directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: ChooseTeamPage
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
  declarations: [ChooseTeamPage]
})
export class ChooseTeamPageModule {}
