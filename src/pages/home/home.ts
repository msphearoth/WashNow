import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  notification: any;
  constructor(public navCtrl: NavController) {
    this.getNotification();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  getNotification() {
    if(localStorage.getItem('notification') == null) {
      this.notification = 'notifications-off';
    } else {
      this.notification = localStorage.getItem('notification');
    }
  }

  setNotification() {
    if(localStorage.getItem('notification') == null) {
      localStorage.setItem('notification', 'notifications-off');
    } else {
      if(localStorage.getItem('notification') == 'notifications-off') {
        localStorage.setItem('notification', 'notifications');
      } else {
        localStorage.setItem('notification', 'notifications-off');
      }
    }
    this.getNotification();
  }

  openMap() {
    this.navCtrl.push(MapPage);
  }

}
