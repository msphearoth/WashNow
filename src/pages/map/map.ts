import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, Events } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationProvider } from '../../providers/location/location';
import { GoogleMapProvider } from '../../providers/google-map/google-map';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public maps: GoogleMapProvider, public platform: Platform, public locations: LocationProvider, public alertCtrl: AlertController, public diagnostic: Diagnostic, public events: Events) {

  }

  ionViewDidLoad(){
    this.platform.ready().then(() => {
      this.diagnostic.isLocationAvailable().then((state) => {
        this.showConfirm();
      });
      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
      let locationsLoaded = this.locations.load();
      Promise.all([
          mapLoaded,
          locationsLoaded
      ]).then((result) => {
        let locations = result[1];
        if (locations == null) {
          console.log('Error: data is undefined.');
        } else {
          for(let location of locations){
            let latLng = new google.maps.LatLng(location.latitude, location.longitude);

            let marker = new google.maps.Marker({
              map: this.maps.map,
              animation: google.maps.Animation.DROP,
              position: latLng
            });
            this.maps.markers.push(marker);
            google.maps.event.addListener(marker, 'click',(event) =>{
              localStorage.setItem('locationId', location.id);
              this.events.publish('refresh-locationId');
              this.navCtrl.popToRoot();
            });
          }
        }
      });
    });
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Please turn on your location setting',
      message: 'WashNow needs to know where your current location is to give you the information of the nearest laundry places.',
      buttons: [
        {
          text: 'Go to setting',
          handler: () => {
            console.log('Go to setting clicked.');
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('No clicked')
          }
        }
      ]
    });
    confirm.present();
  }
}
