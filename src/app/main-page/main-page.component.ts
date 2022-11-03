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

  public versionSorted: any = { sorted: false, type: 'A' };
  public dateSorted: any = { sorted: false, type: 'A' };
  public ratingSorted: any = { sorted: false, type: 'A' };
  private backup: any = {};
  public searched: boolean = false;
  public versions: any[] = [];
  public years: any[] = [];

  constructor(
    private data: DataService,
    private android: DataAndroidService,
    private ios: DataIosService
  ) {}

  ngOnInit(): void {
    this.data.shouldUpdate.subscribe((shouldUpdate) => {
      if (shouldUpdate) {
        this.reset();
        this.app = this.data.getSelectedApp();
        if (Object.keys(this.app).length > 0) {
          this.noSelection = false;
        }
        let allReviews: any[] = [];
        if (this.app.isAndroid) {
          allReviews = this.android.getAndroidReviews();
          this.reviews = allReviews.find((x) => x.app == this.app.appId);
        } else if (this.app.isIOS) {
          allReviews = this.ios.getIOSReviews();
          this.reviews = allReviews.find((x) => x.app == this.app.id);
        }

        // IOS
        if (this.app.isIOS) {
          let temp: any[] = [];
          if (Object.keys(this.reviews.reviews).length > 0) {
            this.reviews.reviews.forEach((rev: any) => {
              rev.entry.forEach((ent: any) => {
                temp.push(ent);
              });
            });
            this.reviews = temp;
            this.reviews.sort((a: any, b: any) => {
              return new Date(a.updated.label) > new Date(b.updated.label)
                ? -1
                : 1;
            });
            this.reviews.forEach((rev: any) => {
              this.versions = this.data.addIfNotAdded(
                rev['im:version'].label,
                this.versions
              );
              const year = new Date(rev.updated.label).getFullYear();
              this.years = this.data.addIfNotAdded(year, this.years);
            });
            console.log({ year: this.years, versions: this.versions });
            this.dateSorted.sorted = true;
          }
        } else {

          // Android
          if (Object.keys(this.reviews?.review?.data).length > 0) {
            this.reviews = this.reviews.review.data;
          }
          this.reviews.sort((a: any, b: any) => {
            return new Date(a.date) > new Date(b.date)
              ? -1
              : 1;
          });
          this.reviews.forEach((rev: any) => {
            this.versions = this.data.addIfNotAdded(
              (rev.version ? rev.version : "NA"),
              this.versions
            );
            const year = new Date(rev.date).getFullYear();
            this.years = this.data.addIfNotAdded(year, this.years);
          });
          console.log({ year: this.years, versions: this.versions });
          this.dateSorted.sorted = true;
        }
      }
      this.backup = this.reviews;
    });
  }

  sort(type: string) {
    let platform = this.app.isAndroid ? 'android' : 'ios';
    if (platform == 'ios') {
      switch (type) {
        case 'rating':
          this.reviews.sort((a: any, b: any) => {
            return this.ratingSorted.type == 'D'
              ? a['im:rating'].label > b['im:rating'].label
                ? -1
                : 1
              : a['im:rating'].label > b['im:rating'].label
              ? 1
              : -1;
          });
          this.ratingSorted.type = this.ratingSorted.type == 'A' ? 'D' : 'A';
          this.ratingSorted.sorted = true;
          this.dateSorted.sorted = false;
          this.versionSorted.sorted = false;
          break;
        case 'date':
          this.reviews.sort((a: any, b: any) => {
            return this.dateSorted.type == 'D'
              ? new Date(a.updated.label) > new Date(b.updated.label)
                ? -1
                : 1
              : new Date(a.updated.label) > new Date(b.updated.label)
              ? 1
              : -1;
          });
          this.dateSorted.type = this.dateSorted.type == 'A' ? 'D' : 'A';
          this.dateSorted.sorted = true;
          this.ratingSorted.sorted = false;
          this.versionSorted.sorted = false;
          break;
        case 'version':
          this.reviews.sort((a: any, b: any) => {
            let aVersion = a['im:version'].label.replaceAll('.', '');
            let bVersion = b['im:version'].label.replaceAll('.', '');

            if (this.versionSorted.type == 'A') return aVersion - bVersion;
            else if (this.versionSorted.type == 'D') return bVersion - aVersion;

            return null;
          });
          this.versionSorted.type = this.versionSorted.type == 'A' ? 'D' : 'A';
          this.versionSorted.sorted = true;
          this.dateSorted.sorted = false;
          this.ratingSorted.sorted = false;
          break;
      }
    } else {
      switch (type) {
        case 'rating':
          this.reviews.sort((a: any, b: any) => {
            return this.ratingSorted.type == 'D'
              ? a.score > b.score
                ? -1
                : 1
              : a.score > b.score
              ? 1
              : -1;
          });
          this.ratingSorted.type = this.ratingSorted.type == 'A' ? 'D' : 'A';
          this.ratingSorted.sorted = true;
          this.dateSorted.sorted = false;
          this.versionSorted.sorted = false;
          break;
        case 'date':
          this.reviews.sort((a: any, b: any) => {
            return this.dateSorted.type == 'D'
              ? new Date(a.date) > new Date(b.date)
                ? -1
                : 1
              : new Date(a.date) > new Date(b.date)
              ? 1
              : -1;
          });
          this.dateSorted.type = this.dateSorted.type == 'A' ? 'D' : 'A';
          this.dateSorted.sorted = true;
          this.ratingSorted.sorted = false;
          this.versionSorted.sorted = false;
          break;
        case 'version':
          this.reviews.sort((a: any, b: any) => {
            let aVersion = a.version ? parseInt(a.version).toFixed(2) : '0';
            let bVersion = b.version ? parseInt(b.version).toFixed(2) : '0';

            if (a.version == '0') {
              a.version = null;
            }

            if (b.version == '0') {
              b.version = null;
            }

            if (this.versionSorted.type == 'A')
              return parseInt(aVersion) - parseInt(bVersion);
            else if (this.versionSorted.type == 'D')
              return parseInt(bVersion) - parseInt(aVersion);

            return null;
          });
          this.versionSorted.type = this.versionSorted.type == 'A' ? 'D' : 'A';
          this.versionSorted.sorted = true;
          this.dateSorted.sorted = false;
          this.ratingSorted.sorted = false;
          break;

        default:
          break;
      }
    }
  }

  searchAndFilter(event: any) {
    const platform = this.app.isAndroid ? 'android' : 'ios';
    const text = event.target.value.toLowerCase();
    let temp: any[] = [];

    if (platform == 'ios') {
      this.backup.forEach((data: any) => {
        if (
          data.content.label.toLowerCase().includes(text) ||
          data.title.label.toLowerCase().includes(text)
        ) {
          temp.push(data);
        }
      });
    } else {
      this.backup.forEach((data: any) => {
        if (
          data.text.toLowerCase().includes(text) ||
          data.title?.toLowerCase().includes(text)
        ) {
          temp.push(data);
        }
      });
    }

    this.reviews = temp;
    if (this.backup.length == this.reviews.length) {
      this.searched = false;
    } else {
      this.searched = true;
    }
  }

  reset() {
    this.backup = {};
    this.versions = [];
    this.years = [];
    this.versionSorted = { sorted: false, type: 'D' };
    this.dateSorted = { sorted: false, type: 'D' };
    this.ratingSorted = { sorted: false, type: 'D' };
  }

  versionSelect(event: any) {
    let res = event;
    console.log(this.reviews);
    const platform = this.app.isAndroid ? 'android' : 'ios';
    let temp: any[] = [];
    if (platform == 'ios') {
      this.backup.forEach((data: any) => {
        if (data['im:version'].label == res) {
          temp.push(data);
        }
      });
    } else {
      if(res == "NA") {res = null}
      this.backup.forEach((data: any) => {
        if (data.version == res) {
          temp.push(data);
        }
      });
    }
    this.reviews = temp;

    if (res == -1) {
      this.reviews = this.backup;
    }
  }

  yearSelect(event: any) {
    const res = event;
    const platform = this.app.isAndroid ? 'android' : 'ios';
    let temp: any[] = [];
    if (platform == 'ios') {
      this.backup.forEach((data: any) => {
        if (new Date(data.updated.label).getFullYear() == res) {
          temp.push(data);
        }
      });
    } else {
      this.backup.forEach((data: any)=> {
        if (new Date(data.date).getFullYear() == res) {
          temp.push(data);
        }
      })
    }
    this.reviews = temp;
    if (res == -1) {
      this.reviews = this.backup;
    }
  }

  ratingSelect(res: any[]) {
    const platform = this.app.isAndroid ? 'android' : 'ios';

    let temp: any[] = [];
    this.backup.forEach((data: any) => {
      res.forEach((rating: any) => {
        if(platform == "ios") {
          if(rating.isSelected && data["im:version"].label == rating.value) {
            temp.push(data);
          }
        } else {
          if(rating.isSelected && data.score == rating.value) {
            temp.push(data);
          }
        }
      });
    });
    this.reviews = temp;
  }
}
