import { Component, Input } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';
import { QuestionService } from '../../../services/faq/question.service';
import { __ } from '../../../services/functions';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.page.html',
  styleUrls: ['./create-question.page.scss'],
})
export class CreateQuestionPage extends Modal {
  @Input() public groupId: number;
  @Input() public userId: number;
  public summary: string;
  public description: string;

  /**
   * CreateQuestionPage constructor.
   * @param {ModalController} modalController
   * @param {QuestionService} questionService
   */
  constructor(
    modalController: ModalController,
    private questionService: QuestionService,
  ) {
    super(modalController);
  }

  /**
   * Get a create email page as modal.
   * @param {ModalController} modalController
   * @param {number} groupId
   * @param {number} userId
   * @returns {Promise<HTMLIonModalElement>}
   */
  public static async asModal(modalController: ModalController, groupId: number, userId: number) {
    const modal = await modalController.create({
      component: CreateQuestionPage,
      componentProps: {
        groupId: groupId,
        userId: userId,
        title: __('Stelle eine Frage'),
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
    const question = await this.questionService.createQuestion(
      this.groupId,
      this.userId,
      this.summary,
      this.description,
    ).toPromise();

    this.returnData = question;

    return Object.keys(question).includes('id');
  }
}
