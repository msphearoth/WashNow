import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { LocationProvider } from '../../providers/location/location';
import "rxjs/add/operator/debounceTime";

@Component({
  selector: 'page-location',
  templateUrl: 'location.html'
})
export class LocationPage {

  searchTerm: string = '';
  searchControl: FormControl;
  filteredLocations: any;
  searching: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public locations: LocationProvider, public events: Events) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    let locationsLoaded = this.locations.load();
    Promise.all([
        locationsLoaded
    ]).then((result) => {
      this.getFilteredLocations();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        this.getFilteredLocations();
      });
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  getFilteredLocations() {
    this.filteredLocations = this.locations.data.filter((location) => {
      return location.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  setLocationSetting(location) {
    localStorage.setItem('locationId', location.id);
    console.log(localStorage.getItem('locationId'));
    this.events.publish('refresh-locationId');
    this.navCtrl.popToRoot();
  }
}
