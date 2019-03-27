import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'location/:id',
    loadChildren: './location/location.module#LocationPageModule',
    canActivate: [AuthGuard],
  },
  {path: '**', redirectTo: 'stream', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, enableTracing: true}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
