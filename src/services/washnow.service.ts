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
    this.baseUrl = "http://cclab.kangwon.ac.kr/New/washnow/public/index.php/api/statuses/";
    return this.http.get(this.baseUrl + locationId)
    .map(res => res.json());
  }
}
