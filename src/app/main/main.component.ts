import { Component, OnInit } from '@angular/core';
import {AppService} from '../entities/services/app.service';
import {Router} from '@angular/router';
import * as d3 from 'd3'
import * as scale from 'd3-scale'
import * as force from 'd3-force';
import {Platform} from "@ionic/angular";
import {GRAPH} from "../../mocks/graph.const";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public graph: any;
  public width: any;
  public height: any;
  private _svg: any;


  constructor(
    private _appService: AppService,
    private _route: Router,
    private _platform: Platform) {
    _platform.ready().then((readySource) => {
     let x = 6108/_platform.width();
     this.width = _platform.width();
     this.height = 5650 / x;
     this._createSvg();
    });
  }

  ngOnInit() {
    this._appService.startCoordinate$.subscribe( res => {
   //   res ? console.log(res) : this._route.navigate(['/home']);
    });

  }

  private _createSvg(): void {
   this._svg = d3.selectAll('figure#graph')
     .append('svg')
     .attr('width', this.width)
     .attr('height', this.height)
     .attr("transform", "rotate(206)")
     .attr("viewBox", "10 -25 145 210")
     .append('g')
     .attr('class', 'links');
   d3.select('svg')
     .append('g')
     .attr('class', 'nodes')


    this.graph = this._appService.getGraphMap();
    this._createGraph();
  }


  private _createGraph(): void{
    let xMin = 99999999;
    let xMax = -99999999;
    let yMin = 99999999;
    let yMax = -99999999;

    this.graph.nodes.forEach( (el) => {
      if ( xMin > el.x ) {
        xMin = el.x;
      }
      if ( xMax < el.x) {
        xMax = el.x;
      }
      if ( yMin > el.y ) {
        yMin = el.y;
      }
      if ( yMax < el.y) {
        yMax = el.y;
      }
    });
    console.log(xMin);
    console.log(xMax);
    let linearX = scale.scaleLinear()
      .domain([xMax * (-1),xMin * (-1) ])
      .range([-4, 104])
    let linearY = scale.scaleLinear()
      .domain([yMin,yMax ])
      .range([0, 100])

    for (let i = 0; i < this.graph.links.length; i++){
      this.graph.links[i].coords[0].x = linearX( this.graph.links[i].coords[0].x * (-1));
      this.graph.links[i].coords[0].y = linearY( this.graph.links[i].coords[0].y );
      this.graph.links[i].coords[1].x = linearX( this.graph.links[i].coords[1].x * (-1));
      this.graph.links[i].coords[1].y = linearY( this.graph.links[i].coords[1].y );

    }
    for (let i = 0; i < this.graph.nodes.length; i++) {
      this.graph.nodes[i].x = linearX(  this.graph.nodes[i].x * (-1));
      this.graph.nodes[i].y = linearY( this.graph.nodes[i].y );
    }
   // console.log('Posle',this.graph.links);
   // console.log('dd',this.graph.nodes);
    let graph = this.graph;

/*
    let simulation = force.forceSimulation()
      .nodes(graph.nodes)
      .force('charge', force.forceManyBody().strength(-30))
      .force('center', force.forceCenter(this.width / 2, this.height / 2))
      .force('link', force.forceLink()
        .links(graph.links)
        .id(function(d: any) {
        return d.id})
        .strength( function (d: any, i) {
          return d.weight;
        })
      )
      .force('x', force.forceX().x(function(d: any, i) {
        return graph.links[i].center.x;
      }))
      .force('y', force.forceY().y(function(d: any, i) {
        return graph.links[i].center.y;
      }))
      .on('tick', ticked);
*/

   // function updateLinks() {
      let links = d3.select('.links')
        .selectAll('line')
        .data(graph.links)
        .join('line')
        .attr('x1', function(d: any) {
          return d.coords[0].x;
        })
        .attr('y1', function(d: any) {
          return d.coords[0].y
        })
        .attr('x2', function(d: any) {
          return d.coords[1].x
        })
        .attr('y2', function(d: any) {
          return d.coords[1].y
        })
        .attr("stroke", "red")
        .attr("stroke-width", 0.2);
  //  }

   // function updateNodes() {
     let nodes = d3.select('.nodes')
        .selectAll('circle')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('cx', function(d: any) {
          return d.x
        })
        .attr('cy', function(d: any) {
          return d.y
        })
        .attr('r', function(d) {
          return 0.2
        })
       .attr('fill','green');
   // }

/*    function ticked() {
      updateLinks()
      updateNodes()
    }*/
  }


}
