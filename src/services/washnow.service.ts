import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/Rx';

@Injectable()
export class WashnowService {
  http:any;
  baseUrl: String = "";

  constructor(http:Http, public platform:Platform) {
    this.http = http;
  }
  getStatuses(locationId) {
    if (this.platform.is('android')) {
      this.baseUrl = "/android_asset/www/";
    }
    return this.http.get(this.baseUrl + 'assets/data/status.json')
    .map(res => res.json());
  }
}
