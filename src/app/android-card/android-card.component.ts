import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-android-card',
  templateUrl: './android-card.component.html',
  styleUrls: ['./android-card.component.css']
})
export class AndroidCardComponent implements OnInit {
  @Input() review: any = {};

  constructor() { }

  ngOnInit(): void {
    console.log("check", this.review);
  }

}
