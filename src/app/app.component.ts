import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

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

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public loadingCtrl: LoadingController, public storage: Storage,
              public push: Push, public alertCtrl: AlertController) {
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
      this.initPushNotification();
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

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      "android": {
        "senderID": "197142668480",
        "vibrate": "true",
        "sound": "true",
        "iconColor": "#343434"
      },
      "ios": {
        "alert": "true",
        "badge": "true",
        "sound": "true"
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message -> ' + data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              this.nav.push(HomePage, { message: data.message });
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        this.nav.push(HomePage, { message: data.message });
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }
}
