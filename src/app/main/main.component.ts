import { Component, OnInit } from '@angular/core';
import {AppService} from '../entities/services/app.service';
import {Router} from '@angular/router';
import * as d3 from 'd3'
import * as force from 'd3-force';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public graph: any;
  private _svg: any;
  private _simulation = force;

  constructor( private _appService: AppService, private _route: Router) {

  }

  ngOnInit() {
    this._appService.startCoordinate$.subscribe( res => {
      res ? console.log(res) : this._route.navigate(['/home']);
    });
    this.graph = this._appService.getGraphMap();
    console.log(this.graph);
    this._createSvg();
    this._createGraph();
  }

  private _createSvg(): void {
   this._svg = d3.selectAll('figure#graph')
     .append('svg')
     .attr('width', '100%')
     .attr('height', '100%');
  }

  private _createGraph(): void{
/*    this._simulation.forceSimulation()
      .nodes(this.graph.nodes)
      .force('link', d3.forceLink(this.graph.links).distance(10))
      .force('charge', d3.forceManyBody().strength(-10))
      .force('collide', d3.forceCollide().radius(2).strength(5))
      .force('x', d3.forceX(200).strength(0.1))
      .force('y', d3.forceY(200).strength(0.1))*/

  }


}
