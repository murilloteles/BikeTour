import { Injectable } from '@angular/core';
import {Geolocation} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the RastreadorLocalizacao provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RastreadorLocalizacao {
  positionObserver: any;
  position: any;
  watch: any;

  constructor() {
    this.positionObserver = null;
    this.position = Observable.create(observer => {
        this.positionObserver = observer;
    });
  }


    startTracking() {
    // In App Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = Geolocation.watchPosition(options);

    this.watch.subscribe((data) => {
      alert("what: " + data.coords);
      this.notifyLocation(data.coords);
    });

    return this.position;
  }

    stopTracking() {
     this.watch.unsubscribe();
   }

   notifyLocation(location) {
    alert("mudou");
    this.positionObserver.next(location);
  }
}
