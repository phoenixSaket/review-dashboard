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
    let url = "http://localhost:3000/ios/app";
    return this.http.post(url, { name: parseInt(app) });
  }

  getAppReviews(app: string, page: number) {
    let url = "http://localhost:3000/ios/review";
    return this.http.post(url, { name: app, page: page });
  }

  getAPPRatings(app: string) {
    let url = "http://localhost:3000/ios/rating";
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
