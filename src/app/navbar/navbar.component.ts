import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataIosService } from '../data-ios.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() versions: any[] = [];
  @Input() years: any[] = [];

  @Output() versionSelected: EventEmitter<any> = new EventEmitter();
  @Output() yearSelected: EventEmitter<any> = new EventEmitter();
  @Output() ratingSelected: EventEmitter<any> = new EventEmitter();

  public app: any = {};
  public iosReviews: number = 0;
  public histogram: any = {};
  public ratings: any[] = [
    { value: '1', isSelected: true },
    { value: '2', isSelected: true },
    { value: '3', isSelected: true },
    { value: '4', isSelected: true },
    { value: '5', isSelected: true },
  ];

  constructor(private data: DataService, private ios: DataIosService) {}

  ngOnInit(): void {
    this.data.shouldUpdate.subscribe((shouldUpdate) => {
      if (shouldUpdate) {
        this.app = this.data.getSelectedApp();
        if (this.app?.isIOS) {
          let ratings = this.ios.getIOSRatings();
          let apps = this.ios.getIOSReviews();
          apps.forEach((app) => {
            if (app.app == this.app.id) {
              let length = 0;
              app.reviews.forEach((data: any) => {
                length += data.entry.length;
              });
              this.iosReviews = length;
            }
          });
          let app = ratings.find((x) => x.app == this.app.id);
          this.histogram = app.ratings.histogram;
        } else {
          this.histogram = this.app.histogram;
        }
        this.histogram = this.histogram ? Object.entries(this.histogram) : [];
      }
    });
  }

  versionSelect(event: any) {
    this.versionSelected.emit(event.target.value);
  }

  yearSelect(event: any) {
    this.yearSelected.emit(event.target.value);
  }

  ratingSelect(rating: any) {
    const rate = this.ratings.indexOf(rating);
    this.ratings[rate].isSelected = !this.ratings[rate].isSelected;
    this.ratingSelected.emit(this.ratings);
  }
}
