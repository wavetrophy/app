import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../services/faq/question.service';
import { Subscription } from 'rxjs';
import { Question } from '../../services/faq/types/question';
import { Answer } from '../../services/faq/types/answer';
import { AnswerService } from '../../services/faq/answer.service';
import { AuthService } from '../../services/auth/auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import { EditQuestionPage } from '../../modal/faq/edit-question/edit-question.page';

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
   */
  constructor(
    private ar: ActivatedRoute,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private auth: AuthService,
    private alert: AlertController,
    private modal: ModalController,
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
    const sub = this.answerService.answerQuestion(this.question, this.answer).subscribe(() => {
      this.getQuestion(this.id);
      this.answer = '';
    });
    this.subs.push(sub);
  }

  /**
   * Mark a question as resolved
   * @param {Answer} answer
   * @return {Promise<void>}
   */
  public async resolve(answer: Answer) {
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
   * Delete an answer
   * @param {Answer} answer
   * @return {Promise<void>}
   */
  public async delete(answer: Answer) {
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
