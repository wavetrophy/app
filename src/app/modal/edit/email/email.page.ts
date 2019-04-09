import { Component, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Modal } from '../../modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage extends Modal {
  @ViewChild('input') input: IonInput;

  public constructor(modal: ModalController) {
    super(modal);
  }

  public static async asModal(modalController: ModalController, email: string, onSave: (value: string) => boolean | Promise<boolean> | Observable<boolean>) {
    const modal = await modalController.create({
      component: EmailPage,
      componentProps: {
        value: email,
        title: 'Edit email',
        onSave: onSave,
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    modal.present();
  }


  ionViewDidEnter() {
    this.input.setFocus();
  }
}
