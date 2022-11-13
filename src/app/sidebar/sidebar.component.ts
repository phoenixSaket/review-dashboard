import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() apps: any[] = [];
  @Output() selectedApp: EventEmitter<any> = new EventEmitter();

  public isOpen: boolean = true;
  public appName: any = {};
  screen: any;

  constructor(public data: DataService, private router:Router) { }

  ngOnInit(): void {
    this.screen = screen;
    this.data.shouldUpdate.subscribe(shouldUpdate => {
      if (shouldUpdate) {
        setTimeout(() => {
          let app = this.data.getSelectedApp();
          this.appName = app;
          if (this.apps.find(x => x.altName == app.altName) != undefined) {
            this.apps.find(x => x.altName == app.altName).isSelected = true;
          }
        })
      }
    });

    this.data.sideBarBehavior.subscribe(data=> {
      if(data.bool) {
        this.toggleSideBar();
        this.router.navigate(["/reviews"]);
      }
    })
  }

  selectApp(appSelected: any) {
    this.apps.forEach((app) => {
      app.isSelected = false;
    });
    appSelected.isSelected = true;
    this.toggleSideBar();
    this.router.navigate(["/reviews"]);
    this.selectedApp.emit(appSelected);
  }

  toggleSideBar() {
    if(screen.width < 768) {
      this.isOpen = !this.isOpen;
      this.data.setSide(this.isOpen);
    }
  }
}
