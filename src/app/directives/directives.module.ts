import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequiresConnectionDirective } from './network/requires-connection.directive';
import { GeoDirective } from './maps/geo.directive';

@NgModule({
  declarations: [
    RequiresConnectionDirective,
    GeoDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RequiresConnectionDirective,
    GeoDirective,
  ],
})
export class DirectivesModule {
}
