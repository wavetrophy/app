import { Component, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../services/faq/types/question';
import { QuestionService } from '../../services/faq/question.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { CreateQuestionPage } from '../../modal/faq/create-question/create-question.page';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit, OnDestroy {
  public isLoading = false;
  public errormessage: string;
  public questions: Question[] = [];
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
   * View a question
   * @param {Question} question
   */
  public viewQuestion(question: Question) {
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
    this.isLoading = true;
    const sub = this.questionService.getQuestions(
      // @ts-ignore
      this.auth.data.current_wave.id,
      this.auth.data.group_id,
    ).subscribe((res: any) => {
      this.isLoading = false;
      if (!res) {
        this.errormessage = res['message'] || 'Keine Fragen verfügbar';
        return;
      }
      console.log(res);
      this.questions = res;
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = res['message'] || 'Es ist ein Fehler aufgetreten';
    });
    this.subs.push(sub);
  }
}
