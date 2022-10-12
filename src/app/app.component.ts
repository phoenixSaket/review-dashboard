import { Component } from '@angular/core';
import { DataAndroidService } from './data-android.service';
import { DataIosService } from './data-ios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'review-dashboard';
  private androidApps = [
    "com.ibx.ibxmobile",
    "com.ahnj.ahmobile",
    "com.ahatpa.ahamobile",
    "com.ibxtpa.iamobile"
  ];
  private iosApps = [
    "584785907",
    "1112137390",
    "1337168006",
    "1337166340"
  ];

  constructor(private android: DataAndroidService, private ios: DataIosService) { }

  ngOnInit() {
    this.androidApps.forEach(app => {
      this.android.getAppDetails(app).subscribe((data: any) => {
        let values = this.android.getAndroidApps();
        values.push(JSON.parse(data.result));
        this.android.setAndroidApps(values);
        console.log("Android Apps", this.android.getAndroidApps());
      });

      this.android.getAppReviews(app).subscribe((data: any) => {
        let values = this.android.getAndroidReviews();
        values.push({ app: app, review: JSON.parse(data.result) });
        this.android.setAndroidReviews(values);
        console.log("Android Reviews", this.android.getAndroidReviews());
      });
    });

    this.iosApps.forEach(app => {
      this.ios.getAppDetails(app).subscribe((data: any) => {
        let values = this.ios.getIOSApps();
        values.push(JSON.parse(data.result));
        this.ios.setIOSApps(values);
        console.log("IOS Apps", this.ios.getIOSApps());
      });

      this.ios.getAppReviews(app, 1).subscribe((data: any) => {
        let values = this.ios.getIOSReviews();
        values.push({ app: app, review: data.result });
        this.ios.setIOSReviews(values);
        console.log("IOS Reviews", this.ios.getIOSReviews());
      });

      this.ios.getAPPRatings(app).subscribe((data: any) => {
        let values = this.ios.getIOSRatings();
        values.push({ app: app, ratings: JSON.parse(data.result) });
        this.ios.setIOSRatings(values);
        console.log("IOS Ratings", this.ios.getIOSRatings());
      })
    })
  }
}
