import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/faq/question.service';
import { Subscription } from 'rxjs';
import { Question } from '../../services/faq/types/question';
import { Answer } from '../../services/faq/types/answer';
import { AnswerService } from '../../services/faq/answer.service';
import { AuthService } from '../../services/auth/auth.service';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { EditQuestionPage } from '../../modal/faq/edit-question/edit-question.page';
import { EditAnswerPage } from '../../modal/faq/edit-answer/edit-answer.page';
import { AnswerOptionsPage } from '../../popover/answer-options/answer-options.page';
import { PushNotificationService } from '../../services/firebase/cloud-messaging/push-notification.service';
import { NotificationService } from '../../services/firebase/cloud-messaging/notification.service';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.page.html',
  styleUrls: ['./view-question.page.scss'],
})
/**
 * Class ViewQuestionPage
 */
export class ViewQuestionPage implements OnInit, OnDestroy {
  public id: number;
  public isLoading = false;
  public question: Question = null;
  public isSaving = false;
  public server = '';
  public errormessage: string;
  public answer: string;
  public userId: number;
  private subs: Subscription[] = [];

  /**
   * ViewQuestionPage constructor.
   * @param {ActivatedRoute} ar
   * @param {QuestionService} questionService
   * @param {AnswerService} answerService
   * @param {AuthService} auth
   * @param {AlertController} alert
   * @param {ModalController} modal
   * @param {PopoverController} popopver
   * @param {PushNotificationService} push
   */
  constructor(
    private ar: ActivatedRoute,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private auth: AuthService,
    private alert: AlertController,
    private modal: ModalController,
    private popopver: PopoverController,
    private push: PushNotificationService,
  ) {
  }

  /**
   * On init hook.
   */
  public ngOnInit() {
    this.id = parseInt(this.ar.snapshot.paramMap.get('id'), 10);
    this.userId = this.auth.data.user_id;
    console.log(this.id);
    this.getQuestion(this.id);
  }

  /**
   * On destroy hook
   */
  public ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Save an answer.
   */
  public saveAnswer() {
    const sub = this.answerService.answerQuestion(this.question, this.answer).subscribe((response: any) => {
      this.push.subscribeTo(NotificationService.TOPIC_QUESTION(this.id));
      this.getQuestion(this.id);
      this.answer = '';
    });
    this.subs.push(sub);
  }

  /**
   * Open the options for an answer.
   * @param {Event} event
   * @param {Answer} answer
   * @return {Promise<void>}
   */
  public async openOptions(event, answer: Answer) {
    const popover = await this.popopver.create({
      component: AnswerOptionsPage,
      componentProps: {
        showResolve: this.question.user.id === this.userId,
        showEdit: answer.user_id === this.userId && !answer.approved,
        showDelete: answer.user_id === this.userId && !answer.approved,
      },
      showBackdrop: false,
      event: event,
      translucent: false,
    });
    await popover.present();
    const dismiss = await popover.onDidDismiss();

    if (!dismiss.data) {
      // Ensure that the data is present.
      return;
    }

    if (dismiss.data.type === AnswerOptionsPage.TYPE_RESOLVE) {
      this.resolveAnswer(answer);
    }

    if (dismiss.data.type === AnswerOptionsPage.TYPE_EDIT) {
      this.editAnswer(answer);
    }

    if (dismiss.data.type === AnswerOptionsPage.TYPE_DELETE) {
      this.deleteAnswer(answer);
    }
  }

  /**
   * Edit question
   * @return {Promise<void>}
   */
  public async edit() {
    const modal = await EditQuestionPage.asModal(this.modal, this.question);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      // The user has to log in if he changes the username.
      this.getQuestion(this.id);
    }
  }

  /**
   * Mark a question as resolved
   * @param {Answer} answer
   * @return {Promise<void>}
   */
  private async resolveAnswer(answer: Answer) {
    const alert = await this.alert.create({
      header: 'Accept answer',
      message: 'Are you sure to accept this answer as the best answer. You can only accept one answer once.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Accept',
          handler: async () => {
            this.isLoading = true;
            const sub = this.questionService.resolve(this.question, answer).subscribe(() => this.getQuestion(this.id));
            this.subs.push(sub);
          },
        },
      ],
    });
    alert.present();
  }

  /**
   * Edit an answer
   * @param answer
   * @return {Promise<void>}
   */
  private async editAnswer(answer) {
    const modal = await EditAnswerPage.asModal(this.modal, answer);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      // The user has to log in if he changes the username.
      this.getQuestion(this.id);
    }
  }

  /**
   * Delete an answer
   * @param {Answer} answer
   * @return {Promise<void>}
   */
  private async deleteAnswer(answer: Answer) {
    const alert = await this.alert.create({
      header: 'Accept answer',
      message: 'Are you sure to accept this answer as the best answer. You can only accept one answer once.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Delete',
          handler: async () => {
            this.isLoading = true;
            const sub = this.answerService.deleteAnswer(answer.id).subscribe(() => this.getQuestion(this.id));
            this.subs.push(sub);
          },
        },
      ],
    });
    alert.present();
  }

  /**
   * Get a question
   * @param {number} id
   */
  private getQuestion(id: number) {
    this.errormessage = null;
    this.isLoading = true;
    const sub = this.questionService.getQuestion(id)
      .subscribe((res: any) => {
        this.isLoading = false;
        if (!res) {
          this.errormessage = res['message'] || 'Keine Fragen verfügbar';
          return;
        }
        console.log(res);
        this.question = res;
      }, (res: any) => {
        this.isLoading = false;
        this.errormessage = res['message'] || 'Es ist ein Fehler aufgetreten';
      });
    this.subs.push(sub);
  }
}
