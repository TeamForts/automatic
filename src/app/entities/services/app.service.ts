import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Geolocation} from '@capacitor/geolocation';
import {toFlat} from 'as-geo-projection';


@Injectable({
    providedIn: 'root',
  })

export class AppService {
  private _startCoordinate$$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering,no-underscore-dangle
  public startCoordinate$: Observable<any> = this._startCoordinate$$.asObservable();

  public getCoordinate(): Promise<any> {
    return Geolocation.getCurrentPosition().then( res => {
      const gk = toFlat({longitude: res.coords.longitude, latitude: res.coords.latitude});
      // eslint-disable-next-line no-underscore-dangle
      this._startCoordinate$$.next( gk );
    });
  }
}
