import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'reviews', component: MainPageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'search', component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
