import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as env from "../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class DataIosService {
  public iosAppsDefault = ['584785907', '1112137390', '1337168006', '1337166340', '1340456041'];
  public additionalApps: any[] = [];
  private iosApps: any[] = [];
  private iosReviews: any[] = [];
  private iosRatings: any[] = [];
  public appUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private urlHost = "";

  constructor(private http: HttpClient) { 
    this.urlHost = env.environment.renderLink;
  }

  getAppDetails(app: string) {
    let url = this.urlHost + "ios/app";
    return this.http.post(url, { name: parseInt(app) });
  }

  getAppReviews(app: string, page: number) {
    let url = this.urlHost + "ios/review";
    return this.http.post(url, { name: app, page: page });
  }

  getAPPRatings(app: string) {
    let url = this.urlHost + "ios/rating";
    return this.http.post(url, { name: app });
  }

  searchApp(term: string, num: number, lang: string, price: string) {
    let url = this.urlHost + "ios/search";
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
    this.additionalApps.push(app);
    this.appUpdate.next(true);
  }
}
