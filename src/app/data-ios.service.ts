import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataIosService {
  public iosAppsDefault = ['584785907', '1112137390', '1337168006', '1337166340', '1340456041'];
  private iosApps: any[] = [];
  private iosReviews: any[] = [];
  private iosRatings: any[] = [];
  public appUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  getAppDetails(app: string) {
    let url = "https://review-be.herokuapp.com/ios/app";
    return this.http.post(url, { name: parseInt(app) });
  }

  getAppReviews(app: string, page: number) {
    let url = "https://review-be.herokuapp.com/ios/review";
    return this.http.post(url, { name: app, page: page });
  }

  getAPPRatings(app: string) {
    let url = "https://review-be.herokuapp.com/ios/rating";
    return this.http.post(url, { name: app });
  }

  searchApp(term: string, num: number, lang: string, price: string) {
    let url = "https://review-be.herokuapp.com/ios/search";
    return this.http.post(url, { term: term, num: num, lang: lang, price: price })
  }

  public getIOSApps(): any[] {
    return this.iosApps;
  }

  public setIOSApps(value: any[]) {
    this.iosApps = value;
  }

  public getIOSReviews(): any[] {
    return this.iosReviews;
  }

  public setIOSReviews(value: any[]) {
    this.iosReviews = value;
  }

  public getIOSRatings(): any[] {
    return this.iosRatings;
  }

  public setIOSRatings(value: any[]) {
    this.iosRatings = value;
  }

  public addIOSApp(app: string) {
    this.iosAppsDefault.push(app);
    this.appUpdate.next(true);
  }
}
