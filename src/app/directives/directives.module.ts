import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequiresConnectionDirective } from './network/requires-connection.directive';

@NgModule({
  declarations: [
    RequiresConnectionDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RequiresConnectionDirective,
  ],
})
export class DirectivesModule {
}
