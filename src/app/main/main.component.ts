import { Component, OnInit } from '@angular/core';
import {AppService} from '../entities/services/app.service';
import {Router} from '@angular/router';
import * as d3 from 'd3'
import * as scale from 'd3-scale'
import {Platform} from "@ionic/angular";
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public graph: any;
  public width: number = 700;
  public height: number = 600;
  public fg: FormGroup;

  public xMin = Infinity;
  public xMax = -Infinity;
  public yMin = Infinity;
  public yMax = -Infinity;

  public xStart = null;
  public yStart = null;
  public graphIsBuild = false;

  private _svg: any;


  constructor(
    private _appService: AppService,
    private _route: Router,
    private _platform: Platform,
    private _fb: FormBuilder
  ) {
    this.createForm();

/*    _platform.ready().then((readySource) => {
    // let x = 6108/_platform.width();
    // this.width = _platform.width();
    // this.height = 5650 / x;

    });*/
  }

  ngOnInit() {
    this._appService.startCoordinate$.subscribe( res => {
      if ( res ){
          this.xStart = res.x;
          this.yStart = res.y;
          alert(`Ваши координаты x = ${res.x} , y = ${res.y}`);
      }
    });
    this.createSvg();

  }

  /**
   * Создаем форму для input
   */
  public createForm(): void {
    this.fg = this._fb.group({
      startIndex: [null, Validators.required],
      endIndex: [null, Validators.required],
    })
  }

  /**
   * Создаем svg
   */
  public createSvg(): void {
   this._svg = d3.selectAll('figure#graph')
     .append('svg')
     .attr('width', this.width)
     .attr('height', this.height)
     .attr("transform", "rotate(206)")
    // .attr("viewBox", "10 -25 145 210")
     .attr("viewBox", "-10 -20 170 200")
     .append('g')
     .attr('class', 'links')
   d3.select('svg')
     .append('g')
     .attr('class', 'nodes')
    d3.select('svg')
      .append('g')
      .attr('class', 'minPath')
      .attr( 'opacity', '1');


    this.graph = this._appService.getGraphMap();
    this.graph.nodes = this.graph.nodes.map( (el, index) => {
      el.index = index;
      return el;
    });
    this.graphIsBuild = this.createGraph();
  }


  /**
   * Создаем граф
   */
  public createGraph(): boolean {

    let graph = this.graph;

    // Ищем минимум/максимум в координатах

    this.graph.nodes.forEach( (el) => {
      if ( this.xMin > el.x ) {
        this.xMin = el.x;
      }
      if ( this.xMax < el.x) {
        this.xMax = el.x;
      }
      if ( this.yMin > el.y ) {
        this.yMin = el.y;
      }
      if ( this.yMax < el.y) {
        this.yMax = el.y;
      }
    });

    // Преобразуем координаты чтобы они входили в область svg

    let linearX = scale.scaleLinear()
      .domain([this.xMax * (-1),this.xMin * (-1) ])
      .range([-4, 104])
    let linearY = scale.scaleLinear()
      .domain([this.yMin,this.yMax ])
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

    // Добавляем ребра

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

    // Добавляем вершины

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
        return 0.1
      })
      .attr('fill','green');

    return true;
  }


  /**
   * Строим путь от начальной точки до конечной
   * @param start - индекс начальной точки
   * @param end - индекс конечной точки
   */
  public buildPath(start = 20, end = 150): void {


    start = +this.fg.controls['startIndex'].value;
    end = +this.fg.controls['endIndex'].value;

    if ( this.graph.nodes.find( el => start === el.index) && this.graph.nodes.find( el => end === el.index) )
    {
      d3.select('.minPath')
        .selectAll('path')
        .remove();
      let indexNodes = this.getPath(this.createAdjacencyMatrix(), start, end);

      indexNodes = indexNodes.map(indexNode => {
        return this.graph.nodes.find(node => {
          if (node.index === indexNode) {
            // console.log(node.index);
            return node;
          }
        })
      }).reverse();

      let line = d3.line()
        .x(function (d: any) {
          return d.x;
        })
        .y(function (d: any) {
          return d.y;
        });
      let path = d3.select('.minPath')
        .append('path')
        .attr("d", line(indexNodes))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr('fill', 'none');
    } else {
      alert('Индекс должен быть числом от 0 до 198');
    }
  }


  /**
   * Создание матрицы смежности из графа
   * @private
   */
  public createAdjacencyMatrix(): any {
    let matrix = [];
    let size =  this.graph.nodes.length;

    this.graph.links = this.graph.links.map( el => {
      el.weight = Math.trunc(el.weight);
      return el;
    })

    for (let i = 0; i < size; i++) {
      matrix.push([]);
      for (let j = 0; j < size; j++) {
        matrix[i][j] = 0;
      }
    }

    this.graph.nodes.forEach( ( node ) => {
        this.graph.links.forEach( (el) => {
           if ( node.id === el.source || node.id === el.target) {
             let targetNode = this.graph.nodes.find( node => node.id === el.target);
              addEdge(node.index, targetNode.index, el.weight);
           }
        })
    })

    function addEdge(vertex1, vertex2, weight = 0) {
      if (vertex1 > size - 1 || vertex2 > size - 1) {

      } else if (vertex1 === vertex2) {

      } else {
        matrix[vertex1][vertex2] = weight;
        matrix[vertex2][vertex1] = weight;
      }
    }

    return matrix;
  }

  /**
   * Алгоритм поиска минимального пути
   * @param matrix матрица смежности
   * @param start индекс начальной точки
   * @param end индекс конечной точки
   */

  public getPath(matrix, start = 0, end = 1): any {
    let minDistance = []; // минимальное расстояние
    let visitedNodes = []; // посещенные вершины
    let temp, minindex, min;
    let begin_index = start;

    //Инициализация вершин и расстояний
    for (let i = 0; i < matrix.length; i++) {
      minDistance[i] = Infinity;
      visitedNodes[i] = 1;
    }
    minDistance[begin_index] = 0;
    // Шаг алгоритма
     do {
      minindex = Infinity;
      min = Infinity;
      for (let i = 0; i < matrix.length; i++){
        // Если вершину ещё не обошли и вес меньше min
        if ((visitedNodes[i] == 1) && (minDistance[i]<min)){
          // Переприсваиваем значения
          min = minDistance[i];
          minindex = i;
        }
      }
      // Добавляем найденный минимальный вес
      // к текущему весу вершины
      // и сравниваем с текущим минимальным весом вершины
      if (minindex != Infinity) {
        for (let i = 0; i < matrix.length; i++)
        {
          if (matrix[minindex][i] > 0)
          {
            temp = min + matrix[minindex][i];
            if (temp < minDistance[i])
            {
              minDistance[i] = temp;
            }
          }
        }
        visitedNodes[minindex] = 0;
      }
    } while (minindex < Infinity);
    // Вывод кратчайших расстояний до вершин
    // console.log("\nКратчайшие расстояния до вершин: \n");
    for (let i = 0; i < matrix.length; i++){
      // console.log(minDistance[i]);
    }


    // Восстановление пути
    let ver = []; // массив посещенных вершин
    ver[0] = end; // начальный элемент - конечная вершина
    let k = 1; // индекс предыдущей вершины
    let weight = minDistance[end]; // вес конечной вершины
    // пока не дошли до начальной вершины
    while (end != begin_index) {
      for (let i = 0; i < matrix.length; i++) // просматриваем все вершины
      if (matrix[i][end] != 0)   // если связь есть
      {
        let temp = weight - matrix[i][end]; // определяем вес пути из предыдущей вершины
        if (temp == minDistance[i]) // если вес совпал с рассчитанным
        {                 // значит из этой вершины и был переход
          weight = temp; // сохраняем новый вес
          end = i;       // сохраняем предыдущую вершину
          ver[k] = i; // и записываем ее в массив
          k++;
        }
      }
    }

   // for (let i = k - 1; i >= 0; i--)

    return ver;
  }

}

