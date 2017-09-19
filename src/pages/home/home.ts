import { Component } from '@angular/core';
import { AlertController, NavController, Platform, Events, ToastController } from 'ionic-angular';
import { WashnowService } from '../../services/washnow.service';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ConnectivityProvider } from '../../providers/connectivity/connectivity';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  oldLocationId: string;
  locationId: string;
  locationName: string;
  notification: any;
  items: any;
  availableMachines: any;
  lastUpdateDateTime: string;
  constructor(public navCtrl: NavController, private washnowService: WashnowService, public push: Push, public platform: Platform,
              public alertCtrl: AlertController, public events: Events, public connectivityService: ConnectivityProvider, public toastCtrl: ToastController) {
    this.refreshPage();
    this.events.subscribe('refresh-locationId', () => {
      this.refreshPage();
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      if (this.connectionToast()) {
        this.getStatuses(this.locationId);
      }
      refresher.complete();
    }, 500);
  }

  getStatuses(locationId) {
    this.washnowService.getStatuses(locationId).subscribe(data => {
      this.items = data.statuses;
      this.locationName = data.locationName;
      this.availableMachines = data.available;
      this.lastUpdateDateTime = new Date().toISOString();
    });
  }

  getNotification() {
    this.notification = localStorage.getItem('notification');
    this.initPushNotification();
  }

  setNotification() {
    if(localStorage.getItem('notification') == 'notifications-off') {
      localStorage.setItem('notification', 'notifications');
    } else {
      localStorage.setItem('notification', 'notifications-off');
    }
    this.getNotification();
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    let topics: string[] = [this.locationId];
    const options: PushOptions = {
      "android": {
        "senderID": "197142668480",
        "vibrate": "true",
        "sound": "true",
        "iconColor": "#343434",
        "topics": topics
      },
      "ios": {
        "alert": "true",
        "badge": "true",
        "sound": "true"
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.unsubscribe(this.oldLocationId);
    if (this.notification == 'notifications') {
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
                this.navCtrl.popToRoot();
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          this.navCtrl.popToRoot();
          console.log('Push notification clicked');
        }
        //Unregister the old topics
        pushObject.unregister();
      });

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
    } else {
      //Unregister the old topics
      pushObject.unregister();
    }
  }

  openMap() {
    this.navCtrl.push(MapPage);
  }

  refreshPage() {
    if (this.connectionToast()) {
      this.oldLocationId = this.locationId;
      this.locationId = localStorage.getItem('locationId');
      this.getNotification();
      this.getStatuses(this.locationId);
    }
  }

  connectionToast() {
    if (this.connectivityService.isOffline()) {
      let toast = this.toastCtrl.create({
        message: 'No connection',
        duration: 10000,
        showCloseButton: true
      });
      toast.present();
      return false;
    } else {
      return true;
    }
  }
}
