import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as env from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataAndroidService {
  public androidAppsDefault = [
    'com.ibx.ibxmobile',
    'com.ahnj.ahmobile',
    'com.ahatpa.ahamobile',
    'com.ibxtpa.iamobile',
    'com.ahc.ahcmobile'
  ];
  public additionalApps: any[] = [];
  private androidApps: any[] = [];
  private androidReviews: any[] = [];
  private androidRatings: any[] = [];
  public appUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private urlHost = "https://review-un6v.onrender.com/";

  constructor(private http: HttpClient) { 
  }

  getAppDetails(app: string) {
    let url = this.urlHost + "android/app";
    return this.http.post(url, { name: app });
  }

  getAppReviews(app:string) {
    let url = this.urlHost + "android/review";
    return this.http.post(url, { name: app });
  }

  searchApp(term: string, num: number, lang: string, price: string) {
    let url = this.urlHost + "android/search";
    return this.http.post(url, { term: term, num: num, lang: lang, price: price })
  }

  public getAndroidApps(): any[] {
    return this.androidApps;
  }

  public setAndroidApps(value: any[]) {
    this.androidApps = value;
  }

  public getAndroidReviews(): any[] {
    return this.androidReviews;
  }

  public setAndroidReviews(value: any[]) {
    this.androidReviews = value;
  }

  public getAndroidRatings(): any[] {
    return this.androidRatings;
  }

  public setAndroidRatings(value: any[]) {
    this.androidRatings = value;
  }

  public addAndroidApp(app: string) {
    this.additionalApps.push(app);
    this.appUpdate.next(true);
  }
}
