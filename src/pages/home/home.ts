import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WashnowService } from '../../services/washnow.service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  locationId: string;
  locationName: string;
  notification: any;
  items: any;
  availableMachines: any;
  constructor(public navCtrl: NavController, private washnowService: WashnowService, private localNotifications: LocalNotifications) {
    this.locationId = localStorage.getItem('locationId');
    this.getNotification();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getStatuses(this.locationId);
      refresher.complete();
    }, 500);
  }

  ngOnInit() {
    this.getStatuses(this.locationId);
  }

  getStatuses(locationId) {
    this.washnowService.getStatuses(locationId).subscribe(data => {
        this.items = data.statuses;
        this.locationName = data.locationName;
        this.availableMachines = data.available;
    });
  }

  getNotification() {
    if(localStorage.getItem('notification') == null) {
      this.notification = 'notifications-off';
    } else {
      this.notification = localStorage.getItem('notification');
      if (this.notification == 'notifications') {
        this.setIntervalForNotification();
      }
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

  setIntervalForNotification() {
    var temp = this;
    var notiInterval = setInterval(function(){
      if (temp.availableMachines > 0) {
        temp.localNotifications.schedule({
            title: "WashNow",
            text: "Washers are available now. Laundry Time :)",
            at: new Date(new Date().getTime() + 5 * 1000),
            sound: 'file://assets/sounds/notification.mp3'
        });
        clearInterval(notiInterval);
      } else {
        temp.getStatuses(this.locationId);
      }
    }, 5000);
  }

  openMap() {
    this.navCtrl.push(MapPage);
  }

}
