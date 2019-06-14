import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'wave',
    component: TabsPage,
    children: [
      {
        path: 'stream',
        children: [{
          path: '',
          loadChildren: './stream/stream.module#StreamPageModule',
        }],
      },
      {
        path: 'contacts',
        children: [{
          path: '',
          loadChildren: './contacts/contacts.module#ContactsPageModule',
        }],
      },
      {
        path: 'faq',
        children: [{
          path: '',
          loadChildren: './faq/faq.module#FaqPageModule',
        }],
      },
      {
        path: 'hotels',
        children: [{
          path: '',
          loadChildren: './hotels/hotels.module#HotelsPageModule',
        }],
      },
      {path: '', redirectTo: '/wave/stream', pathMatch: 'full'},
    ],
  },
  {path: '', redirectTo: '/wave/stream', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
