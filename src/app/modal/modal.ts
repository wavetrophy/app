import { ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { from } from 'rxjs';

export abstract class Modal {

  @ViewChild('focus') autofocus: IonInput;
  public value: any;
  public title: any;
  public isSaving = false;
  private _error: string;

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
    from(this.onSave()).subscribe(
      result => {
        this.isSaving = false;
        if (result) {
          this.modal.dismiss({type: 'success'});
        }
      },
      e => {
        this.isSaving = false;
        console.log(e);
        this.error = e.error.violations[0].message || e.error.title || 'Something went wrong. Please try again later';
      },
    );
  }

  /**
   * Set an error
   * @param {string} error
   */
  public set error(error: string) {
    this._error = error;
  }

  /**
   * Get error
   * @returns {string | any}
   */
  public get error() {
    return this._error;
  }

  /**
   * IonViewDidEnter hook.
   */
  public ionViewDidEnter() {
    if (!(this.autofocus instanceof IonInput)) {
      return;
    }
    this.autofocus.setFocus();
  }
}
