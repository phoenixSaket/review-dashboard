import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataIosService {
  private iosApps: any[] = [];
  private iosReviews: any[] = [];
  private iosRatings: any[] = [];

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
}
