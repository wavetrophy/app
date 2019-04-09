import { Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

export class Modal {

  @Input() public value: any;
  @Input() public title: any;
  @Input() public onSave: (value: any) => boolean | Promise<boolean> | Observable<boolean>;

  public constructor(protected modal: ModalController) {
  }

  public close() {
    this.modal.dismiss({type: 'cancelled'});
  }

  public save() {
    of(this.onSave(this.value)).subscribe(result => {
      if (result) {
        this.modal.dismiss({type: 'success'});
      }
    });
  }
}
