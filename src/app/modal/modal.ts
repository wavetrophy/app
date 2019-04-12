import { ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { from } from 'rxjs';

export abstract class Modal {

  @ViewChild('focus') autofocus: IonInput;
  public value: any;
  public title: any;
  public isSaving = false;

  /**
   * The on save click hook.
   */
  protected abstract async onSave();

  /**
   * Constructor
   * @param {ModalController} modal
   */
  protected constructor(protected modal: ModalController) {
  }


  /**
   * Close the modal.
   */
  public close() {
    this.modal.dismiss({type: 'cancelled'});
  }

  /**
   * Save on click listener.
   */
  public save() {
    this.isSaving = true;
    from(this.onSave()).subscribe(result => {
      this.isSaving = false;
      if (result) {
        this.modal.dismiss({type: 'success'});
      }
    });
  }

  /**
   * IonViewDidEnter hook.
   */
  ionViewDidEnter() {
    this.autofocus.setFocus();
  }
}
