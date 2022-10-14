import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {
  @Input() rate: number = 0;
  @Input() value: number = 0;
  public rating: any[] = [];

  constructor() {}

  ngOnInit(): void {
    for (let i = 0; i < 5; i++) {
      this.rating.push({ isOn: false });
    }
    for (let i = 0; i < this.rate; i++) {
      this.rating[i] = { isOn: true };
    }
  }
}
