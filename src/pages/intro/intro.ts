import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {

  baseUrl: string = "";
  constructor(public navCtrl: NavController, public platform: Platform) {
    if (this.platform.is('android')) {
      this.baseUrl = "/android_asset/www/";
    }
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }
}
