import { Component } from '@angular/core';
import { StreamPage } from './stream/stream.page';
import { Tab2Page } from '../tab2/tab2.page';
import { Tab3Page } from '../tab3/tab3.page';

// TODO change to @Component
const typeDecorator = Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
});

@typeDecorator
export class TabsPage {
  public streamPage: any = StreamPage;
  public tab2Page: any = Tab2Page;
  public tab3Page: any = Tab3Page;
}
