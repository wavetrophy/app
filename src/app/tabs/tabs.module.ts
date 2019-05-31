import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { StreamPageModule } from './stream/stream.module';
import { ContactsPageModule } from './contacts/contacts.module';
import { FaqPageModule } from './faq/faq.module';
import { HotelsPageModule } from './hotels/hotels.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    SuperTabsModule,
    StreamPageModule,
    FaqPageModule,
    HotelsPageModule,
    ContactsPageModule,
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {
}
