import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditEmailPageModule } from './email/edit/edit-email.module';
import { EditUsernamePageModule } from './username/edit/edit-username.module';
import { CreateEmailPageModule } from './email/create/create-email.module';
import { CreatePhonenumberPageModule } from './phonenumber/create/create-phonenumber.module';
import { EditPhonenumberPageModule } from './phonenumber/edit/edit-phonenumber.module';
import { ViewContactPageModule } from './contacts/view/view-contact.module';
import { CreateQuestionPageModule } from './faq/create-question/create-question.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EditEmailPageModule,
    EditUsernamePageModule,
    EditPhonenumberPageModule,
    CreatePhonenumberPageModule,
    CreateEmailPageModule,
    ViewContactPageModule,
    CreateQuestionPageModule,
  ],
  exports: [
    EditEmailPageModule,
    EditUsernamePageModule,
    CreateEmailPageModule,
    EditPhonenumberPageModule,
    CreatePhonenumberPageModule,
    ViewContactPageModule,
    CreateQuestionPageModule,
  ],
})
export class ModalModule {
}
