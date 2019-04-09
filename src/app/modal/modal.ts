import { ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { from, Observable } from 'rxjs';

export class Modal {

  @ViewChild('focus') autofocus: IonInput;
  public value: any;
  public title: any;
  public onSave: (value: any) => boolean | Promise<boolean> | Observable<boolean>;
  public isSaving:boolean = false;

  public constructor(protected modal: ModalController) {
  }

  public close() {
    this.modal.dismiss({type: 'cancelled'});
  }

  public save() {
    this.isSaving = true;
    from(this.onSave(this.value)).subscribe(result => {
      this.isSaving = false;
      if (result) {
        this.modal.dismiss({type: 'success'});
      }
    });
  }

  ionViewDidEnter() {
    this.autofocus.setFocus();
  }
}
