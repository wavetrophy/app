import { NgModule } from '@angular/core';
import { Nl2brPipe } from './nl2br.pipe';

@NgModule({
  declarations: [
    Nl2brPipe,
  ],
  exports: [
    Nl2brPipe,
  ],
})
export class PipeModule {
  public static forRoot() {
    return {
      ngModule: PipeModule,
      providers: [],
    };
  }
}
