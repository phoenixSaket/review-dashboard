import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-android-card',
  templateUrl: './android-card.component.html',
  styleUrls: ['./android-card.component.css'],
})
export class AndroidCardComponent implements OnInit {
  @Input() review: any = {};
  public rating: any[] = [];
  public date: string = '';

  constructor() {}

  ngOnInit(): void {
    this.setRating();
    this.setDate();
  }

  setRating() {
    const rate = this.review.score;
    for (let i = 0; i < 5; i++) {
      if (i < rate) {
        this.rating.push({ isOn: true });
      } else {
        this.rating.push({ isOn: false });
      }
    }
  }

  setDate() {
    const date = new Date(this.review.date);
    const day = date.getDate();
    const month = this.getMonthName(date.getMonth());
    const year = date.getFullYear();

    this.date = day + ' ' + month + ' ' + year;
  }

  getMonthName(monthNumber: number) {
    let month: string = '';
    switch (monthNumber) {
      case 0:
        month = 'Jan';
        break;
      case 1:
        month = 'Feb';
        break;
      case 2:
        month = 'Mar';
        break;
      case 3:
        month = 'Apr';
        break;
      case 4:
        month = 'May';
        break;
      case 5:
        month = 'Jun';
        break;
      case 6:
        month = 'Jul';
        break;
      case 7:
        month = 'Aug';
        break;
      case 8:
        month = 'Sep';
        break;
      case 9:
        month = 'Oct';
        break;
      case 10:
        month = 'Nov';
        break;
      case 11:
        month = 'Dec';
        break;

      default:
        break;
    }

    return month;
  }
}
