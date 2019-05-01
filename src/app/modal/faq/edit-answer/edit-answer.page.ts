import { Component, Input } from '@angular/core';
import { Modal } from '../../modal';
import { Answer } from '../../../services/faq/types/answer';
import { ModalController } from '@ionic/angular';
import { Question } from '../../../services/faq/types/question';
import { AnswerService } from '../../../services/faq/answer.service';

@Component({
  selector: 'app-edit-answer',
  templateUrl: './edit-answer.page.html',
  styleUrls: ['./edit-answer.page.scss'],
})
export class EditAnswerPage extends Modal {
  @Input() public answer: Answer;

  constructor(
    modalController: ModalController,
    private answerService: AnswerService,
  ) {
    super(modalController);
  }

  /**
   * Get a create email page as modal.
   * @param {ModalController} modalController
   * @param {Answer} answer
   * @returns {Promise<HTMLIonModalElement>}
   */
  public static async asModal(modalController: ModalController, answer: Answer) {
    const modal = await modalController.create({
      component: EditAnswerPage,
      componentProps: {
        answer: answer,
        title: 'Edit your answer',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    await modal.present();

    return modal;
  }

  /**
   * On save method
   * @return {Promise<any>}
   */
  protected async onSave(): Promise<any> {
    const answer = await this.answerService.updateAnswer(this.answer).toPromise();

    return Object.keys(answer).includes('id');
  }
}
