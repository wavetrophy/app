import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-answer-options',
  templateUrl: './answer-options.page.html',
  styleUrls: ['./answer-options.page.scss'],
})
/**
 * AnswerOptionsPage
 */
export class AnswerOptionsPage {
  public static TYPE_RESOLVE = 'resolve';
  public static TYPE_EDIT = 'edit';
  public static TYPE_DELETE = 'delete';

  @Input() public showResolve = false;
  @Input() public showEdit = false;
  @Input() public showDelete = false;

  /**
   * AnswerOptionsPageConstructor
   * @param {PopoverController} popoverCtrl
   */
  constructor(private popoverCtrl: PopoverController) {
  }

  /**
   * Dismiss popover.
   * @returns {Promise<void>}
   */
  public async dismiss(data: any = null): Promise<void> {
    try {
      await this.popoverCtrl.dismiss(data);
    } catch (e) {
      // click more than one time popover throws error, so ignore...
    }
  }


  /**
   * Mark a question as resolved
   * @return {Promise<void>}
   */
  public async resolve() {
    this.dismiss({type: AnswerOptionsPage.TYPE_RESOLVE});
  }

  /**
   * Delete an answer
   * @return {Promise<void>}
   */
  public async delete() {
    this.dismiss({type: AnswerOptionsPage.TYPE_DELETE});
  }

  /**
   * Edit an answer
   * @param answer
   * @return {Promise<void>}
   */
  public async edit() {
    this.dismiss({type: AnswerOptionsPage.TYPE_EDIT});
  }
}
