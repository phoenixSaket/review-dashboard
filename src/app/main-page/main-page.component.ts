import { Component, OnInit } from '@angular/core';
import { DataAndroidService } from '../data-android.service';
import { DataIosService } from '../data-ios.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  public app: any = {};
  public reviews: any = {};
  public noSelection: boolean = true;

  constructor(
    private data: DataService,
    private android: DataAndroidService,
    private ios: DataIosService
  ) {}

  ngOnInit(): void {
    this.data.shouldUpdate.subscribe((shouldUpdate) => {
      if (shouldUpdate) {
        this.app = this.data.getSelectedApp();
        if(Object.keys(this.app).length > 0) {
          this.noSelection = false;
        }
        let allReviews: any[] = [];
        if (this.app.isAndroid) {
          allReviews = this.android.getAndroidReviews();
          this.reviews = allReviews.find(x => x.app == this.app.appId);
        } else if (this.app.isIOS) {
          allReviews = this.ios.getIOSReviews();
          this.reviews = allReviews.find(x => x.app == this.app.id);
        } 
      }
    });
  }
}
