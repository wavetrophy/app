import { Component, Input, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { of } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage {
  @Input() public value: any;
  @Input() public title: any;
  @Input() public onSave: (value: any) => boolean;
  @ViewChild('input') input: IonInput;

  constructor(private modal: ModalController) {
  }

  ionViewDidEnter() {
    this.input.setFocus();
  }

  close() {
    this.modal.dismiss({type: 'cancelled'});
  }

  save() {
    of(this.onSave(this.value)).subscribe(result => {
      if (result) {
        this.modal.dismiss({type: 'success'});
      }
    });
  }
}
