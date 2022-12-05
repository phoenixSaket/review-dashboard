import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public shouldUpdate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public sideBarBehavior: BehaviorSubject<any> = new BehaviorSubject<any>({bool: false, app: {}});
  public selectedApp: any = {};
  public isSideOpen: boolean = true;

  constructor() { }

  getSelectedApp(): any {
    return this.selectedApp;
  }

  setSelectedApp(app: any) {
    this.selectedApp = app;
  }

  addIfNotAdded(entry: any, array: any[]) {
    if(!array.includes(entry)) {array.push(entry)};
    return array;
  }

  sideOpened() {
    return this.isSideOpen;
  }

  setSide(value: boolean) {
    this.isSideOpen = value;
  }

  toggleSideBar() {
    this.sideBarBehavior.next({bool: true});
  }

  storeOnLocalStorage(apps: any[]) {
    localStorage.setItem("apps", JSON.stringify(apps));
  }

  getFromLocalStorage() {
    let apps = [];
    if(typeof(JSON.parse(localStorage.getItem("apps") || "")) == "object") {
      apps = JSON.parse(localStorage.getItem("apps") || "");
    }
    return apps;
  }

}
