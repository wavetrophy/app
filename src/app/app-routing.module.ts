import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {
    path: 'location/:id',
    loadChildren: './location/location.module#LocationPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canActivate: [AuthGuard],
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
  { path: 'create', loadChildren: './modal/faq/create/create.module#CreatePageModule' },
  { path: 'create-question', loadChildren: './modal/faq/create-question/create-question.module#CreateQuestionPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
