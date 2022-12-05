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
    'com.ahc.ahcmobile',
  ];
  private iosApps = [
    '584785907',
    '1112137390',
    '1337168006',
    '1337166340',
    '1340456041',
  ];

  public apps: any[] = [];

  constructor(
    private android: DataAndroidService,
    private ios: DataIosService,
    public data: DataService
  ) {}

  ngOnInit() {
    let androidApps: string[] = [];
    let iosApps: string[] = [];
    let apps = this.data.getFromLocalStorage();
    if (apps.length > 0) {
      apps.forEach((app: any) => {
        if (app.isIOS) {
          iosApps.push(app.id);
        } else {
          androidApps.push(app.appId);
        }
      });
    }

    if (androidApps.length > 0 || iosApps.length > 0) {
      if (androidApps.length == 0 && iosApps.length > 0) {
        this.iosApps = iosApps;
        this.androidApps = [];
      } else if (iosApps.length == 0 && androidApps.length > 0) {
        this.iosApps = [];
        this.androidApps = androidApps;
      } else if (androidApps.length > 0 && iosApps.length > 0) {
        this.androidApps = androidApps;
        this.iosApps = iosApps;
      }
    } else {
      this.iosApps = this.ios.iosAppsDefault;
      this.androidApps = this.android.androidAppsDefault;
    }

    this.data.shouldUpdate.subscribe((shouldUpdate) => {
      if (shouldUpdate) {
        this.getApps();
      }
    });
    
    this.androidApps.forEach((app) => {
      this.android.getAppDetails(app).subscribe((data: any) => {
        let values = this.android.getAndroidApps();
        values.push(JSON.parse(data.result));
        this.android.setAndroidApps(values);
        this.getAndroidRatings(JSON.parse(data.result));
        this.data.shouldUpdate.next(true);
        // console.log('Android Apps', this.android.getAndroidApps());
      });

      this.android.getAppReviews(app).subscribe((data: any) => {
        let values = this.android.getAndroidReviews();
        values.push({ app: app, review: JSON.parse(data.result) });
        this.android.setAndroidReviews(values);
        this.data.shouldUpdate.next(true);
        // console.log('Android Reviews', this.android.getAndroidReviews());
      });

    });

    this.iosApps.forEach((app) => {
      this.apps = [];
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

    this.ios.appUpdate.subscribe((data: boolean) => {
      if (data) {
        this.ios.iosAppsDefault.push(this.ios.additionalApps[0]);
        this.iosApps = JSON.parse(JSON.stringify(this.ios.additionalApps));
        this.ios.additionalApps.pop();

        this.iosApps.forEach((app) => {
          this.ios.getAppDetails(app).subscribe((data: any) => {
            let values = this.ios.getIOSApps();
            let newVal = JSON.parse(data.result);
            newVal['isAdd'] = true;
            values = this.pushIfNotPresent(newVal, values);
            this.ios.setIOSApps(values);
            // console.log('IOS Apps', this.ios.getIOSApps());
            this.data.shouldUpdate.next(true);
          });

          this.getMaxPages(app);

          this.ios.getAPPRatings(app).subscribe((data: any) => {
            let values = this.ios.getIOSRatings();
            values = this.pushRatingIfNotPresent(
              { app: app, ratings: JSON.parse(data.result) },
              values
            );
            this.ios.setIOSRatings(values);
            // console.log('IOS Ratings', this.ios.getIOSRatings());
            this.data.shouldUpdate.next(true);
          });
        });
      }
    });

    this.android.appUpdate.subscribe((data: boolean) => {
      if (data) {
        this.android.androidAppsDefault.push(this.android.additionalApps[0]);
        this.androidApps = JSON.parse(
          JSON.stringify(this.android.additionalApps)
        );
        this.android.additionalApps.pop();

        this.androidApps.forEach((app) => {
          this.android.getAppDetails(app).subscribe((data: any) => {
            let values = this.android.getAndroidApps();
            let newVal = JSON.parse(data.result);
            newVal['isAdd'] = true;
            values = this.pushIfNotPresent(newVal, values);
            this.android.setAndroidApps(values);
            this.getAndroidRatings(JSON.parse(data.result));
            this.data.shouldUpdate.next(true);

            // console.log('Android Apps', this.android.getAndroidApps());
          });

          this.android.getAppReviews(app).subscribe((data: any) => {
            let values = this.android.getAndroidReviews();
            values = this.pushRatingIfNotPresent(
              { app: app, review: JSON.parse(data.result) },
              values
            );
            this.android.setAndroidReviews(values);
            // console.log('Android Reviews', this.android.getAndroidReviews());

            this.data.shouldUpdate.next(true);
          });

          // this.data.shouldUpdate.subscribe((shouldUpdate) => {
          //   if (shouldUpdate) {
          //     this.getApps();
          //   }
          // });
        });
      }
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
        altName: this.getAppName('android', app.appId, app),
      };
      apps.push(app);
    });

    iosApps.forEach((app) => {
      app = {
        ...app,
        isIOS: true,
        altName: this.getAppName('ios', app.id.toString(), app),
      };
      apps.push(app);
    });

    apps.sort((a, b) =>
      a.altName > b.altName ? 1 : b.altName > a.altName ? -1 : 0
    );
    this.apps = apps;
    this.data.storeOnLocalStorage(apps);
  }

  getAppName(platform: string, appName: string, app: any) {
    let res = '';
    if (platform == 'android') {
      switch (appName) {
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
        case 'com.ahc.ahcmobile':
          res = 'AH Caritas (Android)';
          break;
        default:
          res = app.title + ' (Android)';
          break;
      }
    } else if (platform == 'ios') {
      switch (appName) {
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
          res = app.title + ' (IOS)';
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

  pushIfNotPresent(entry: any, array: any[]): any[] {
    let temp: any[] = [];
    let id = entry.id || entry.appId;
    let found = array.find((el) => el.id == id || el.appId == id);
    if (Object.keys(found || {}).length == 0) {
      array.push(entry);
    }
    temp = array;
    return temp;
  }

  pushRatingIfNotPresent(entry: any, array: any[]): any[] {
    let temp: any[] = [];
    let id = entry.app;
    let found = array.find((el) => el.app == id);
    if (Object.keys(found || {}).length == 0) {
      array.push(entry);
    }
    temp = array;
    console.log(temp);
    return temp;
  }
}
