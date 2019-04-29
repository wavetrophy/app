import { Component, OnInit } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.page.html',
  styleUrls: ['./create-question.page.scss'],
})
export class CreateQuestionPage extends Modal implements OnInit {
  public summary: string;
  public description: string;

  /**
   * CreateQuestionPage constructor.
   * @param {ModalController} modalController
   */
  constructor(modalController: ModalController) {
    super(modalController);
  }

  ngOnInit() {
  }

  protected async onSave(): Promise<any> {

  }

}
