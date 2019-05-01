import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../services/faq/types/question';
import { QuestionService } from '../../services/faq/question.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { CreateQuestionPage } from '../../modal/faq/create-question/create-question.page';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

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
   */
  constructor(
    private questionService: QuestionService,
    private auth: AuthService,
    private modal: ModalController,
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
        this.errormessage = res['message'] || 'Keine Fragen verfügbar';
        return;
      }
      const questions = {};
      res.forEach((question: Question) => {
        const date = new Date(question.asked_at);
        const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}`;
        if (!Object.keys(questions).includes(key)) {
          questions[key] = [];
        }
        questions[key].push(question);
      });
      console.log(questions);
      this.questionGroups = questions;
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = res['message'] || 'Es ist ein Fehler aufgetreten';
    });
    this.subs.push(sub);
  }
}
