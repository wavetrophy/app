import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../services/faq/types/question';
import { QuestionService } from '../../services/faq/question.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { CreateQuestionPage } from '../../modal/faq/create-question/create-question.page';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { PushNotificationService } from '../../services/firebase/cloud-messaging/push-notification.service';
import { NotificationService } from '../../services/firebase/cloud-messaging/notification.service';
import { e } from '../../services/functions';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit, OnDestroy {
  public ObjectKeys = Object.keys;
  public isLoading = false;
  public questionGroups: { [key: string]: Question[] } = {};
  public moment = moment;
  public errormessage: string;
  public server = '';
  private subs: Subscription[] = [];

  /**
   * FAQ Page constructor.
   * @param {QuestionService} questionService
   * @param {AuthService} auth
   * @param {ModalController} modal
   * @param {PushNotificationService} push
   */
  constructor(
    private questionService: QuestionService,
    private auth: AuthService,
    private modal: ModalController,
    private push: PushNotificationService,
  ) {
    this.server = environment.api.url;
  }

  /**
   * On init hook
   */
  public ngOnInit() {
    this.getQuestions();
  }

  /**
   * On destroy hook
   */
  public ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Add question
   */
  public async askQuestion() {
    const modal = await CreateQuestionPage.asModal(this.modal, this.auth.data.group_id, this.auth.data.user_id);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      // Subscribe user to his own questions
      this.push.subscribeTo(NotificationService.TOPIC_QUESTION(dismiss.data.returned.id));
      this.getQuestions();
    }
  }

  /**
   * Get all questions
   */
  private getQuestions() {
    this.errormessage = null;
    this.isLoading = true;
    const sub = this.questionService.getQuestions(
      // @ts-ignore
      this.auth.data.current_wave.id,
      this.auth.data.group_id,
    ).subscribe((res: [] | any) => {
      this.isLoading = false;
      if (!res) {
        this.errormessage = e(res, 'message') || 'Keine Fragen verfügbar';
        return;
      }
      const questions = {};
      res.forEach((question: Question) => {
        const date = moment(question.asked_at);
        const key = date.format('YYYY-MM-DD');
        if (!Object.keys(questions).includes(key)) {
          questions[key] = [];
        }
        questions[key].push(question);
      });
      this.questionGroups = questions;
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = e(res, 'message') || 'Es ist ein Fehler aufgetreten';
    });
    this.subs.push(sub);
  }
}
