import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WashnowService } from '../services/washnow.service';

import { HomePage } from '../pages/home/home';
import { LocationPage } from '../pages/location/location';
import { AboutPage } from '../pages/about/about';
import { IntroPage } from '../pages/intro/intro';

@Component({
  templateUrl: 'app.html',
  providers: [WashnowService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  loader: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public loadingCtrl: LoadingController, public storage: Storage) {
    this.initializeApp();

    this.presentLoading();
    this.platform.ready().then(() => {
      this.storage.get('introShown').then((result) => {
        if(result){
          this.rootPage = HomePage;
        } else {
          this.rootPage = IntroPage;
          this.storage.set('introShown', true);
        }
        this.loader.dismiss();
      });
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Find Location', component: LocationPage },
      { title: 'About', component: AboutPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    this.loader.present();
  }
}
