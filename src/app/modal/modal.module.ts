import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailPageModule } from './edit/email/email.module';
import { UsernamePageModule } from './edit/username/username.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EmailPageModule,
    UsernamePageModule,
  ],
  exports: [
    EmailPageModule,
    UsernamePageModule,
  ]
})
export class ModalModule { }
