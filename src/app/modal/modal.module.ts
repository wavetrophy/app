import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditEmailPageModule } from './edit/email/email.module';
import { EditUsernamePageModule } from './edit/username/username.module';
import { CreateEmailPageModule } from './create/email/create-email.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CreateEmailPageModule,
    EditEmailPageModule,
    EditUsernamePageModule,
  ],
  exports: [
    EditEmailPageModule,
    EditUsernamePageModule,
    CreateEmailPageModule,
  ],
})
export class ModalModule {
}
