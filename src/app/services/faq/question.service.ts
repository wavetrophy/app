import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AnswerService } from './answer.service';
import { Question } from './types/question';
import { Answer } from './types/answer';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly server: string;

  /**
   * Question service constructor
   * @param {HttpClient} http
   * @param {AnswerService} answerService
   */
  constructor(
    private http: HttpClient,
    private answerService: AnswerService,
  ) {
    this.server = environment.api.url + '/api';
  }

  /**
   * Get all questions
   * @param {number} waveId
   * @param {number} groupId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @returns {Observable<object>}
   */
  public getQuestionsForGroup(waveId: number, groupId: number, forceReload: boolean = false): Observable<object> {
    if (!waveId || !groupId) {
      return this.getAllQuestions();
    }

    const url = `${this.server}/waves/${waveId}/groups/${groupId}/questions`;

    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }
    return this.http.get(url, {headers: headers});
  }

  /**
   * Get all questions
   * @return {Observable<Object>}
   */
  public getAllQuestions(forceReload: boolean = false) {
    const url = `${this.server}/questions`;

    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }
    return this.http.get(url, {headers: headers});
  }

  /**
   * Get single questions
   * @param {number} questionId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @returns {Observable<object>}
   */
  public getQuestion(questionId: number, forceReload: boolean = false): Observable<object> {
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }
    return this.http.get(`${this.server}/questions/${questionId}`, {headers: headers});
  }

  /**
   * Update a question
   * @param {Question} question
   * @return {Observable<Object>}
   */
  public updateQuestion(question: Question) {
    const data = {
      title: question.title,
      question: question.question,
    };
    return this.http.put(`${this.server}/questions/${question.id}`, data);
  }

  /**
   * Create a question.
   * @param {number} groupId
   * @param {number} userId
   * @param {string} title
   * @param {string} question
   */
  public createQuestion(groupId: number, userId: number, title: string, question: string) {
    const data = {
      title: title,
      question: question,
      user: `/api/users/${userId}`,
    };
    if (groupId) {
      data['groupId'] = `/api/groups/${groupId}`;
    }
    return this.http.post(`${this.server}/questions`, data);
  }

  /**
   * Resolve a question
   * @returns {Promise<Observable<Object>>}
   * @param question
   * @param answer
   */
  public resolve(question: Question, answer: Answer) {
    const data = {resolved: true};
    this.answerService.approveAnswer(answer.id).subscribe();
    return this.http.put(`${this.server}/questions/${question.id}`, data);
  }
}
