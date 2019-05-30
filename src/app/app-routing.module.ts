import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {
    path: 'event/:id',
    loadChildren: './event/event.module#EventPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'hotel/:id',
    loadChildren: './hotel/hotel.module#HotelPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: './profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'question/:id',
    loadChildren: './faq/view-question/view-question.module#ViewQuestionPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canActivate: [AuthGuard],
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
  { path: 'password-change', loadChildren: './modal/user/password-change/password-change.module#PasswordChangePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
