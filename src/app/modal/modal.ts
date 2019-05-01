import { ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { from } from 'rxjs';
import { ValidationError } from './types/validation-error';

export abstract class Modal {

  @ViewChild('focus') autofocus: IonInput;
  public value: any;
  public title: any;
  public isSaving = false;
  private _error: string;
  private _errors: ValidationError[] = [];

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
        this.errors = e.error.violations;
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
   * Set all errors
   * @param {string} errors
   */
  public set errors(errors: ValidationError[]) {
    this._errors = errors;
  }

  /**
   * Get errors
   * @returns {ValidationError[]}
   */
  public get errors() {
    return this._errors;
  }

  /**
   * Check if error exists.
   * @param {string} path
   * @return {boolean}
   */
  public existsError(path: string): boolean {
    if (this.errors.length < 1) {
      return false;
    }
    const found = this.errors.find((value) => {
      return value.propertyPath === path;
    });
    return !!found;
  }

  /**
   * Get an error message
   * @param {string} path
   * @return {string}
   */
  public getError(path: string) {
    if (this.errors.length < 1) {
      return false;
    }
    const found = this.errors.find((value) => {
      return value.propertyPath === path;
    });
    if (!found) {
      return '';
    }
    return found.message;
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
