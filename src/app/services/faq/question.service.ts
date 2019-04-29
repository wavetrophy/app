import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly server: string;

  /**
   * Question service constructor
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) {
    this.server = environment.api.url + '/api';
  }

  /**
   * Get all questions
   * @param {number} waveId
   * @param {number} groupId
   * @returns {Observable<object>}
   */
  public getQuestions(waveId: number, groupId: number): Observable<object> {
    let url = `${this.server}/questions`;
    if (groupId && waveId) {
      url = `${this.server}/waves/${waveId}/groups/${groupId}/questions`;
    }
    return this.http.get(url);
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
    return this.http.post(`${this.server}/questions`, JSON.stringify(data));
  }

  /**
   * Resolve a question
   * @param {number} questionId
   * @returns {Promise<Observable<Object>>}
   */
  public async resolve(questionId: number) {
    const data = {resolved: true};
    return this.http.put(`${this.server}/questions/${questionId}`, JSON.stringify(data));
  }
}
