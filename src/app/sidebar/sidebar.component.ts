import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataAndroidService } from '../data-android.service';
import { DataIosService } from '../data-ios.service';
import { DataService } from '../data.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  @Input() apps: any[] = [];
  @Output() selectedApp: EventEmitter<any> = new EventEmitter();

  public isOpen: boolean = true;
  public appName: any = {};
  public isDeleting: boolean = false;
  screen: any;

  constructor(
    public data: DataService, 
    private router: Router, 
    private ios: DataIosService, 
    private android: DataAndroidService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.screen = screen;
    this.data.shouldUpdate.subscribe((shouldUpdate) => {
      if (shouldUpdate) {
        setTimeout(() => {
          let app = this.data.getSelectedApp();
          this.apps.forEach((el) => {
            el.isSelectedForDelete = false;
          });
          this.appName = app;
          if (this.apps.find((x) => x.altName == app.altName) != undefined) {
            this.apps.find((x) => x.altName == app.altName).isSelected = true;
          }
          this.cdr.detectChanges();
        }, 100);
      }
      this.cdr.detectChanges();

    });

    this.data.sideBarBehavior.subscribe((data) => {
      if (data.bool) {
        this.toggleSideBar();
        this.router.navigate(['/reviews']);
      }
    });
    this.cdr.detectChanges();
  }

  selectApp(appSelected: any) {
    this.apps.forEach((app) => {
      app.isSelected = false;
    });
    appSelected.isSelected = true;
    if (this.screen.width < 768) {
      this.toggleSideBar();
    }
    this.router.navigate(['/reviews']);
    this.selectedApp.emit(appSelected);
  }

  toggleSideBar() {
    // if(screen.width < 768) {
    this.isOpen = !this.isOpen;
    this.data.setSide(this.isOpen);
    // }
  }

  toggleDelete() {
    this.isDeleting = !this.isDeleting;
    if (this.isDeleting) {
      this.apps.forEach((app) => {
        app.isSelected = false;
        app.isSelectedForDelete = false;
      });
    }
  }

  selectForDelete(app: any) {
    this.apps.find((x) => x.altName == app.altName).isSelectedForDelete =
      !this.apps.find((x) => x.altName == app.altName).isSelectedForDelete;
  }

  deleteApps() {
    let ios: any[] =[];
    let android: any[] =[];
    this.apps.forEach((app) => {
      if(app.isSelectedForDelete) {
        if(app.isIOS) {
          ios.push(app.id);
        } else {
          android.push(app.appId)
        }
      }
    });
    console.log({ios: ios, android: android});
    if(ios.length > 0) {
      let values = this.ios.getIOSApps();
      ios.forEach(el=> {
        values.splice(values.findIndex(appToFind => appToFind.id === el), 1);
      })
      this.ios.setIOSApps(values);
    }
    if(android.length > 0) {
      let values = this.android.getAndroidApps();
      android.forEach(el=> {
        values.splice(values.findIndex(appToFind => appToFind.appId === el), 1);
      })
      this.android.setAndroidApps(values);
    }
    this.data.shouldUpdate.next(true);
    this.toggleDelete();
  }
}
