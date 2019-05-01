import { Component, Input } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';
import { QuestionService } from '../../../services/faq/question.service';
import { Question } from '../../../services/faq/types/question';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.page.html',
  styleUrls: ['./edit-question.page.scss'],
})
export class EditQuestionPage extends Modal {
  @Input() public question: Question;

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
   * @param {Question} question
   * @returns {Promise<HTMLIonModalElement>}
   */
  public static async asModal(modalController: ModalController, question: Question) {
    const modal = await modalController.create({
      component: EditQuestionPage,
      componentProps: {
        question: question,
        title: 'Edit your question',
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
    const question = await this.questionService.updateQuestion(this.question).toPromise();

    return Object.keys(question).includes('id');
  }
}
