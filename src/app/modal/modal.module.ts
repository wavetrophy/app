import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditEmailPageModule } from './edit/email/email.module';
import { EditUsernamePageModule } from './edit/username/username.module';
import { CreateEmailPageModule } from './create/email/create-email.module';
import { CreatePhonenumberPageModule } from './create/create-phonenumber/create-phonenumber.module';
import { PhonenumberPageModule } from './edit/phonenumber/phonenumber.module';
import { ViewContactPageModule } from './contacts/view-contact/view-contact.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CreateEmailPageModule,
    EditEmailPageModule,
    EditUsernamePageModule,
    PhonenumberPageModule,
    CreatePhonenumberPageModule,
    ViewContactPageModule,
  ],
  exports: [
    EditEmailPageModule,
    EditUsernamePageModule,
    CreateEmailPageModule,
    PhonenumberPageModule,
    CreatePhonenumberPageModule,
    ViewContactPageModule,
  ],
})
export class ModalModule {
}
