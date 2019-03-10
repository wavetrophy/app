import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPage } from './login/login.page';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [
        LoginPage,
    ],
    imports: [
        CommonModule,
        IonicModule,
        AuthRoutingModule,
    ],
})
export class AuthModule {
}
