import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../entities/services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public coords: any;


  constructor( private _route: Router , private _appService: AppService) {
  }


  public getStartCoordinates(): void {
    // eslint-disable-next-line no-underscore-dangle
    this._appService.getCoordinate().then(res =>   this._route.navigate(['/main']).then());
  }

}
