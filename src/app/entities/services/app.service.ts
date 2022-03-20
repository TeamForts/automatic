import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Geolocation} from '@capacitor/geolocation';
import {toFlat} from 'as-geo-projection';
import {GRAPH} from "../../../mocks/graph.const";


@Injectable({
    providedIn: 'root',
  })

export class AppService {
  /**
   *  _startCoordinate$$ - начальные координаты
   * @private
   */
  private _startCoordinate$$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public startCoordinate$: Observable<any> = this._startCoordinate$$.asObservable();

  private _graphMap$$: BehaviorSubject<any> = new BehaviorSubject<any>(GRAPH);
  public graphMap$: Observable<any> = this._graphMap$$.asObservable();

  public getCoordinate(): Promise<any> {
    return Geolocation.getCurrentPosition().then( res => {
      const gk = toFlat({longitude: res.coords.longitude, latitude: res.coords.latitude});
      this._startCoordinate$$.next( gk );
    });
  }

  public getGraphMap(): any {
   return this._graphMap$$.value;
  }
}
