import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataAndroidService {
  private androidApps: any[] = [];
  private androidReviews: any[] = [];

  constructor(private http: HttpClient) { }

  getAppDetails(app: string) {
    let url = "http://localhost:3000/android/app";
    return this.http.post(url, { name: app });
  }

  getAppReviews(app:string) {
    let url = "http://localhost:3000/android/review";
    return this.http.post(url, { name: app });
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
}
