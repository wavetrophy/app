import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ImageComponent } from './components/image.component';
import { ImageCache } from './providers/image-cache.service';
import { ImageCacheConfig } from './providers/image-cache-config.service';
import { IonicModule } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ImageComponent,
  ],
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
  ],
  exports: [
    ImageComponent,
  ],
})
export class ImageCacheModule {
  static forRoot(): ModuleWithProviders {
    // Based on https://github.com/zyra/ionic-image-loader
    return {
      ngModule: ImageCacheModule,
      providers: [
        ImageCacheConfig,
        ImageCache,
        File,
      ],
    };
  }
}
