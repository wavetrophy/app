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
        loadChildren: './stream/stream.module#StreamPageModule',
      },
      {
        path: 'contacts',
        loadChildren: './contacts/contacts.module#ContactsPageModule',
      },
      {
        path: 'faq',
        loadChildren: './faq/faq.module#FaqPageModule',
      },
      {
        path: 'hotels',
        loadChildren: './hotels/hotels.module#HotelsPageModule',
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
