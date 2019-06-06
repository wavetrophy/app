import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditEmailPageModule } from './email/edit/edit-email.module';
import { EditUsernamePageModule } from './username/edit/edit-username.module';
import { CreateEmailPageModule } from './email/create/create-email.module';
import { CreatePhonenumberPageModule } from './phonenumber/create/create-phonenumber.module';
import { EditPhonenumberPageModule } from './phonenumber/edit/edit-phonenumber.module';
import { ViewContactPageModule } from './contacts/view/view-contact.module';
import { CreateQuestionPageModule } from './faq/create-question/create-question.module';
import { EditQuestionPageModule } from './faq/edit-question/edit-question.module';
import { EditAnswerPageModule } from './faq/edit-answer/edit-answer.module';
import { ChooseTeamPageModule } from './team/choose/choose-team.module';
import { PasswordChangePageModule } from './user/password-change/password-change.module';
import { RegisterPageModule } from './auth/register/register.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChooseTeamPageModule,
    EditEmailPageModule,
    EditUsernamePageModule,
    EditPhonenumberPageModule,
    EditQuestionPageModule,
    EditAnswerPageModule,
    CreatePhonenumberPageModule,
    CreateEmailPageModule,
    CreateQuestionPageModule,
    ViewContactPageModule,
    PasswordChangePageModule,
    RegisterPageModule,
  ],
  exports: [
    ChooseTeamPageModule,
    EditEmailPageModule,
    EditUsernamePageModule,
    EditPhonenumberPageModule,
    EditQuestionPageModule,
    EditAnswerPageModule,
    CreateEmailPageModule,
    CreatePhonenumberPageModule,
    CreateQuestionPageModule,
    ViewContactPageModule,
    PasswordChangePageModule,
    RegisterPageModule,
  ],
})
export class ModalModule {
}
