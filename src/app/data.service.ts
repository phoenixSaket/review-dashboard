import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public shouldUpdate: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public selectedApp: any = {};

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

}
