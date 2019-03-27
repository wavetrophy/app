import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  public id;

  constructor(private ar: ActivatedRoute) {
    console.log('LocationPage');
  }

  ngOnInit() {
    this.id = this.ar.snapshot.paramMap.get('id');
    console.log(this.id);
  }

}
