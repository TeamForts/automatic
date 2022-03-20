import { Component, OnInit } from '@angular/core';
import {AppService} from '../entities/services/app.service';
import {Router} from '@angular/router';
import * as d3 from 'd3'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public _svg: any;

 constructor( private _appService: AppService, private _route: Router) {

  }

  ngOnInit() {
    // eslint-disable-next-line no-underscore-dangle
    this._appService.startCoordinate$.subscribe( res => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions,no-underscore-dangle
      res ? console.log(res) : this._route.navigate(['/home']);
    });
    this._createSvg();
  }

  public _createSvg(): void {
   this._svg = d3.selectAll('figure#graph')
     .append('svg')
     .attr('width', '100%')
     .attr('height', '100%');
  }


}
