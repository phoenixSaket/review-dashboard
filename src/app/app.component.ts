import { Component } from '@angular/core';
import { DataAndroidService } from './data-android.service';
import { DataIosService } from './data-ios.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Review Dashboard';
  private androidApps = [
    'com.ibx.ibxmobile',
    'com.ahnj.ahmobile',
    'com.ahatpa.ahamobile',
    'com.ibxtpa.iamobile',
  ];
  private iosApps = ['584785907', '1112137390', '1337168006', '1337166340'];

  public iosTempRatings = [];
  public apps: any[] = [];

  constructor(
    private android: DataAndroidService,
    private ios: DataIosService,
    private data: DataService
  ) {}

  ngOnInit() {
    this.androidApps.forEach((app) => {
      this.android.getAppDetails(app).subscribe((data: any) => {
        let values = this.android.getAndroidApps();
        values.push(JSON.parse(data.result));
        this.android.setAndroidApps(values);
        this.getAndroidRatings(JSON.parse(data.result));
        // console.log('Android Apps', this.android.getAndroidApps());
      });

      this.android.getAppReviews(app).subscribe((data: any) => {
        let values = this.android.getAndroidReviews();
        values.push({ app: app, review: JSON.parse(data.result) });
        this.android.setAndroidReviews(values);
        // console.log('Android Reviews', this.android.getAndroidReviews());
      });

      this.data.shouldUpdate.subscribe((shouldUpdate) => {
        if (shouldUpdate) {
          this.getApps();
        }
      });
    });

    this.iosApps.forEach((app) => {
      this.ios.getAppDetails(app).subscribe((data: any) => {
        let values = this.ios.getIOSApps();
        values.push(JSON.parse(data.result));
        this.ios.setIOSApps(values);
        // console.log('IOS Apps', this.ios.getIOSApps());
        this.data.shouldUpdate.next(true);
      });

      this.getMaxPages(app);

      this.ios.getAPPRatings(app).subscribe((data: any) => {
        let values = this.ios.getIOSRatings();
        values.push({ app: app, ratings: JSON.parse(data.result) });
        this.ios.setIOSRatings(values);
        // console.log('IOS Ratings', this.ios.getIOSRatings());
        this.data.shouldUpdate.next(true);
      });
    });
  }

  getIOSRatings(app: string, max: number) {
    for (let i = 1; i <= max; i++) {
      this.ios.getAppReviews(app, i).subscribe((data: any) => {
        // console.log("waa", data);
        let values = this.ios.getIOSReviews();
        if (values.find((x) => x.app == app)) {
          let index: any = values.findIndex((x) => x.app == app);
          values[index].reviews.push(JSON.parse(data.result).feed);
        } else {
          let review = [JSON.parse(data.result).feed];
          values.push({ app: app, reviews: review });

          this.ios.setIOSReviews(values);
        }
        // console.log('IOS Reviews', this.ios.getIOSReviews());
        this.data.shouldUpdate.next(true);
      });
    }
  }

  getMaxPages(app: string) {
    let maxPages: number = -1;
    this.ios.getAppReviews(app, 1).subscribe((data: any) => {
      data = JSON.parse(data?.result);

      let links = data.feed.link;
      links.forEach((link: any) => {
        if (link.attributes.rel == 'last') {
          let url = link.attributes.href;
          let index = url.indexOf('page=');
          let indexNext = url.indexOf('/', index);
          maxPages = parseInt(url.substring(index + 5, indexNext));
          this.getIOSRatings(app, maxPages);
        }
      });
    });
  }

  getAndroidRatings(app: any) {
    let data: any = {};
    data.name = app.title;
    data.id = app.appId;
    data.ratings = app.histogram;

    let values = this.android.getAndroidRatings();
    values.push(data);
    this.android.setAndroidRatings(values);
    // console.log('Android Ratings', this.android.getAndroidRatings());
  }

  getApps() {
    let androidApps: any[] = this.android.getAndroidApps();
    let iosApps: any[] = this.ios.getIOSApps();
    let apps: any[] = [];
    androidApps.forEach((app) => {
      app = {
        ...app,
        isAndroid: true,
        altName: this.getAppName('android', app.appId),
      };
      apps.push(app);
    });

    iosApps.forEach((app) => {
      app = {
        ...app,
        isIOS: true,
        altName: this.getAppName('ios', app.id.toString()),
      };
      apps.push(app);
    });

    this.apps = apps;
  }

  getAppName(platform: string, app: string) {
    let res = '';
    if (platform == 'android') {
      switch (app) {
        case 'com.ibx.ibxmobile':
          res = 'IBX (Android)';
          break;
        case 'com.ahnj.ahmobile':
          res = 'AHNJ (Android)';
          break;
        case 'com.ahatpa.ahamobile':
          res = 'AHA (Android)';
          break;
        case 'com.ibxtpa.iamobile':
          res = 'IA (Android)';
          break;
        case '1340456041':
          res = 'AH Caritas';
          break;
        default:
          break;
      }
    } else if (platform == 'ios') {
      switch (app) {
        case '584785907':
          res = 'IBX (IOS)';
          break;
        case '1112137390':
          res = 'AHNJ (IOS)';
          break;
        case '1337168006':
          res = 'AHA (IOS)';
          break;
        case '1337166340':
          res = 'IA (IOS)';
          break;
        case '1340456041':
          res = 'AH Caritas (IOS)';
          break;
        default:
          break;
      }
    } else {
      console.log('ERROR : check platform');
    }
    return res;
  }

  appSelected(app: any) {
    this.data.setSelectedApp(app);
    this.data.shouldUpdate.next(true);
  }
}
