import { Component, OnInit } from '@angular/core';
import { DataAndroidService } from '../data-android.service';
import { DataIosService } from '../data-ios.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public term: string = "";
  public num: number = 20;
  public lang: string = "";
  public price: string = "";
  public results: any[] = [];
  public pageHeight: string = "";
  public options: any[] = [{ name: "Android", isSelected: true }, { name: "IOS", isSelected: false }]

  constructor(private android: DataAndroidService, private ios: DataIosService, private data: DataService) { }

  ngOnInit(): void {}

  inputValue(event: any, type: string) {
    const value = event.target.value;

    switch (type) {
      case "term":
        this.term = value;
        break;
      case "num":
        this.num = value;
        break;
      case "lang":
        this.lang = value;
        break;
      case "price":
        this.price = value;
        break;

      default:
        break;
    }
  }

  search() {
    let selected = "";

    this.options.forEach(opt => {
      if (opt.isSelected) { selected = opt.name; }
    })
    if (selected == "Android") {
      this.android.searchApp(this.term, this.num, this.lang, this.price).subscribe((data: any) => {
        console.log("Search:", data)
        if (data.opstatus == 0) {
          this.results = JSON.parse(data.result);
          console.log(this.results);
        }
      })
    } else {
      this.ios.searchApp(this.term, this.num, this.lang, this.price).subscribe((data: any) => {
        console.log("Search:", data)
        if (data.opstatus == 0) {
          this.results = JSON.parse(data.result);
          console.log(this.results);
        }
      })
    }
  }

  optionChanged(event: any) {
    const value = event.target.value;

    this.options.forEach((el: any) => {
      if(el.name == value) {
        el.isSelected = true;
      } else {
        el.isSelected = false;
      }
    });
  }

  addApp(app: any) {
    let selected = "";
    this.data.toggleSideBar();

    this.options.forEach(opt => {
      if (opt.isSelected) { selected = opt.name; }
    })
    if (selected == "Android") {
      this.android.addAndroidApp(app.appId)
    } else {
      this.ios.addIOSApp(app.id);
    }
  }
}
