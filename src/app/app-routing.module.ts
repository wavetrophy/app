import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
    {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
    {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
    {
        path: 'tabs',
        loadChildren: './tabs/tabs.module#TabsPageModule',
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
