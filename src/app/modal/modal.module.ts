import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPageModule } from './edit/edit.module';
import { EmailPageModule } from './edit/email/email.module';
import { UsernamePageModule } from './edit/username/username.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EditPageModule,
    EmailPageModule,
    UsernamePageModule,
  ],
  exports: [
    EditPageModule,
    EmailPageModule,
    UsernamePageModule,
  ]
})
export class ModalModule { }
