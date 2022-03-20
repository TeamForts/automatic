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

  public graph: any;
  private _svg: any;

  constructor( private _appService: AppService, private _route: Router) {

  }

  ngOnInit() {
    this._appService.startCoordinate$.subscribe( res => {
      res ? console.log(res) : this._route.navigate(['/home']);
    });
    this.graph = this._appService.getGraphMap();
    console.log(this.graph);
    this._createSvg();
  }

  private _createSvg(): void {
   this._svg = d3.selectAll('figure#graph')
     .append('svg')
     .attr('width', '100%')
     .attr('height', '100%');
  }

  private _createGraph(): void{
  }


}
