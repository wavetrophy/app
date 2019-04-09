import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Modal } from '../../modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-username',
  templateUrl: './username.page.html',
  styleUrls: ['./username.page.scss'],
})
export class UsernamePage extends Modal {
  @Input() public value: any;
  @Input() public title: any;
  @Input() public onSave: (value: any) => boolean | Promise<boolean> | Observable<boolean>;

  public constructor(modal: ModalController) {
    super(modal);
  }

  public static async asModal(modalController: ModalController, username: string, onSave: (value: string) => boolean | Promise<boolean> | Observable<boolean>) {
    const modal = await modalController.create({
      component: UsernamePage,
      componentProps: {
        value: username,
        title: 'Edit username',
        onSave: onSave,
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    modal.present();
  }
}
