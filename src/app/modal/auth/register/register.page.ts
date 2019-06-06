import { Component } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage extends Modal {

  constructor(modal: ModalController) {
    super(modal);
  }

  public static async asModal(modalController: ModalController) {
    const modal = await modalController.create({
      component: RegisterPage,
      componentProps: {
        title: `Registrieren`,
      },
      showBackdrop: true,
      backdropDismiss: true,
    });
    modal.present();
    return modal;
  }

  protected async onSave(): Promise<any> {
    return true;
  }


}
