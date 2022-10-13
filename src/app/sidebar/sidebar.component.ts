import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() apps: any[] = [];
  @Output() selectedApp: EventEmitter<any> = new EventEmitter();

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.shouldUpdate.subscribe(shouldUpdate => {
      if (shouldUpdate) {
        setTimeout(() => {
          let app = this.data.getSelectedApp();
          if (this.apps.find(x => x.altName == app.altName) != undefined) {
            this.apps.find(x => x.altName == app.altName).isSelected = true;
          }
        })
      }
    })
  }

  selectApp(appSelected: any) {
    this.apps.forEach((app) => {
      app.isSelected = false;
    });
    appSelected.isSelected = true;
    this.selectedApp.emit(appSelected);
  }
}
