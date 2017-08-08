import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LocationPage } from '../pages/location/location';
import { MapPage } from '../pages/map/map';
import { AboutPage } from '../pages/about/about';
import { IntroPage } from '../pages/intro/intro';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationProvider } from '../providers/location/location';
import { GoogleMapProvider } from '../providers/google-map/google-map';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LocationPage,
    MapPage,
    AboutPage,
    IntroPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LocationPage,
    MapPage,
    AboutPage,
    IntroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Geolocation,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationProvider,
    GoogleMapProvider,
    ConnectivityProvider
  ]
})
export class AppModule {}
