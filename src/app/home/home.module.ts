import { HomeComponent } from './containers/home.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    CommonModule
  ],
  exports: [],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule {}
