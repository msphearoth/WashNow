import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationProvider {

  data: any;
  usersCurrentLocation: any;

  constructor(public http: Http, private geolocation: Geolocation, public platform: Platform) {

  }

  load() {

    if(this.data) {
        return Promise.resolve(this.data);
    }

    return new Promise(resolve => {

      var url = "http://www.washnow.com/api/locations";
      this.http.get(url).map(res => res.json()).subscribe(data => {

        if (this.geolocation) {
          console.log('GPS is on!');
        } else {
          console.log('GPS is off!');
        }

        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(
          (position) => {

            this.usersCurrentLocation = position;
            console.log(this.usersCurrentLocation.coords.latitude);

            let usersLocation = {
                lat: this.usersCurrentLocation.coords.latitude,
                lng: this.usersCurrentLocation.coords.longitude
            };
            this.data = this.applyHaversine(data.locations, usersLocation);

            this.data.sort((locationA, locationB) => {
                return locationA.distance - locationB.distance;
            });

            resolve(this.data);
        }).catch((error) => {
          console.log("Error occured while getting location.");
        });

      });

    });

  }

  applyHaversine(locations, usersLocation) {

    locations.map((location) => {

      let placeLocation = {
          lat: location.latitude,
          lng: location.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation,
          'km'
      ).toFixed(2);
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
        miles: 3958.8,
        km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;
  }

  toRad(x){
    return x * Math.PI / 180;
  }
}
