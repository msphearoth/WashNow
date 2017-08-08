import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WashnowService } from '../../services/washnow.service';
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
  availableMachines: string;
  constructor(public navCtrl: NavController, private washnowService: WashnowService) {
    this.locationId = localStorage.getItem('locationId');
    this.getNotification();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
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
