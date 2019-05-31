import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Question } from './types/question';
import { Answer } from './types/answer';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private readonly api: string;

  /**
   * AnswerService constructor
   * @param {HttpClient} http
   */
  constructor(
    private http: HttpClient,
  ) {
    this.api = environment.api.url + '/api';
  }

  /**
   * Answer a question
   * @param {Question} question
   * @param {string} answer
   * @returns {Observable<Object>}
   */
  public answerQuestion(question: Question, answer: string) {
    const url = `${this.api}/answers`;
    return this.http.post(url, {answer: answer, question: `/api/questions/${question.id}`});
  }

  /**
   * Update an answer
   * @param {Answer} answer
   * @return {Observable<Object>}
   */
  public updateAnswer(answer: Answer) {
    return this.http.put(`${this.api}/answers/${answer.id}`, {answer: answer.answer});
  }

  /**
   * Approve an answer
   * @param {number} answerId
   * @returns {Observable<Object>}
   */
  public approveAnswer(answerId: number) {
    const url = `${this.api}/answers/${answerId}`;
    return this.http.put(url, {approved: true});
  }

  /**
   * Delete an answer
   * @param {number} answerId
   * @returns {Observable<Object>}
   */
  public deleteAnswer(answerId: number) {
    return this.http.delete(`${this.api}/answers/${answerId}`);
  }
}
