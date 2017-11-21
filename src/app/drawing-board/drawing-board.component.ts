import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component ({
    selector: 'drawing-board',
    styleUrls: ['./drawing-board.component.less'],
    templateUrl: './drawing-board.component.html'
})

export class DrawingBoardComponent implements AfterViewInit {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private positionMap: any = {};
    private currentIden = 2;

    private svg: any;

    // @ViewChild('canvasElement') canvasEl: ElementRef;
    @ViewChild('svgElement') svgEl: ElementRef;
    constructor() {}

    ngAfterViewInit(): void {
        // this.canvas = <HTMLCanvasElement> document.getElementById('c');
        // this.canvas.width = this.canvas.offsetWidth;
        // this.canvas.height = this.canvas.offsetHeight;
        // this.handleEvent();
        // if (this.canvas.getContext) {
        //     this.context = this.canvas.getContext('2d');
        //     this.initBoard();
        // }

        this.svg = d3.select('#svg');
        console.log(this.svg);
        this.initBoard();
    }

    private handleCallback(eventType: string, config: any, identifier: string): void {
        if (eventType === 'click') {
            switch (config.shape) {
                case 'square':
                    const c: any = {
                        x1: 50,
                        y1: 50,
                        width: 100,
                        height: 100,
                        options: {
                            stroke: '#000'
                        },
                        name: 'sq-' + this.currentIden ++,
                        type: 'element',
                        shape: 'square'
                    };
                    this.drawShape(c);
                    break;
                case 'arrow':
                    const a: any = {
                        x1: 50,
                        y1: 50,
                        x2: 100,
                        y2: 50,
                        options: {
                            stroke: '#000'
                        },
                        name: 'ar',
                        type: 'element',
                        shape: 'arrow'
                    };
                    this.drawShape(a);
                    break;
            }
        }
    }

    private initBoard(): void {
        const config: any = {
            'square': {
                x1: 10,
                y1: 10,
                width: 20,
                height: 20,
                options: {
                    stroke: '#000'
                },
                name: 'sq-1',
                type: 'indicator',
                shape: 'square'
            },
            'arrow': {
                x1: 50,
                y1: 10,
                x2: 70,
                y2: 10,
                direction: 'right',
                name: 'ar-1',
                type: 'indicator',
                options: {
                    stroke: '#000',
                    fill: '#000'
                },
                shape: 'arrow'
            }
        };
        this.drawShape(config['square']);
        this.drawShape(config['arrow']);
    }

    private square(x1: number, y1: number, width: number, height: number, config?: any): void {
        let g = this.svg
            .append('g')
            .classed('dragging', true);

        g   .append('rect')
            .attr('name', config.name)
            .attr('class', 'rectangle')
            .attr('width', width)
            .attr('height', height)
            .attr('id', config.name)
            .attr('fill', '#fff')
            .attr('stroke', config.options.stroke)
            .on('click', () => {
                if (config.type === 'indicator') {
                    this.handleCallback('click', config, config.name);
                }
            })
            .on('dblclick', function () {
                event.preventDefault();
                let some = g.select('text');
                console.log(some);
                g   .append('text')
                    .attr('x', d3.event.x)
                    .attr('y', height / 2)
                    .attr('contentEditable', true)
                    .attr('dy', '.35em')
                    .text('Text here')
                    .on('keyup', function() { this.text = d3.select(this).text(); });
            })
            .call(d3 .drag()
                .on('start', function() {
                    console.log('start');
                })
                .on('drag', function(d) {
                    console.log(d3.event.x);
                    this.setAttribute('x', d3.event.x);
                    this.setAttribute('y', d3.event.y);
                    g.select('text').attr('x', d3.event.x + width / 2);
                    g.select('text').attr('y', d3.event.y + height / 2);
                })
            );
    }

    signum(x) {
        return (x < 0) ? -1 : 1;
    }
    absolute(x) {
        return (x < 0) ? -x : x;
    }

    drawPath(svg, path, startX, startY, endX, endY) {
        // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
        var stroke =  parseFloat(path.getAttribute("stroke-width"));
        // check if the svg is big enough to draw the path, if not, set heigh/width
        if (svg.getAttribute("height") <  endY)                 svg.getAttribute("height", endY);
        if (svg.getAttribute("width" ) < (startX + stroke) )    svg.getAttribute("width", (startX + stroke));
        if (svg.getAttribute("width" ) < (endX   + stroke) )    svg.getAttribute("width", (endX   + stroke));
        
        var deltaX = (endX - startX) * 0.15;
        var deltaY = (endY - startY) * 0.15;
        // for further calculations which ever is the shortest distance
        var delta  =  deltaY < this.absolute(deltaX) ? deltaY : this.absolute(deltaX);

        // set sweep-flag (counter/clock-wise)
        // if start element is closer to the left edge,
        // draw the first arc counter-clockwise, and the second one clock-wise
        var arc1 = 0; var arc2 = 1;
        if (startX > endX) {
            arc1 = 1;
            arc2 = 0;
        }
        // draw tha pipe-like path
        // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 
        path.setAttribute("d",  "M"  + startX + " " + startY +
                        " V" + (startY + delta) +
                        " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*this.signum(deltaX)) + " " + (startY + 2*delta) +
                        " H" + (endX - delta*this.signum(deltaX)) + 
                        " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
                        " V" + endY );
    }

    connectElements(svg, path, startElem, endElem) {
        var svgContainer: any= document.getElementById('svg');

        // if first element is lower than the second, swap!
        if(startElem.getBBox().y > endElem.getBBox().y){
            var temp = startElem;
            startElem = endElem;
            endElem = temp;
        }

        // get (top, left) corner coordinates of the svg container   
        var svgTop  = svgContainer.getBBox().y;
        var svgLeft = svgContainer.getBBox().x;

        // get (top, left) coordinates for the two elements
        var startCoord = startElem.getBBox();
        var endCoord   = endElem.getBBox();

        // calculate path's start (x,y)  coords
        // we want the x coordinate to visually result in the element's mid point
        var startX = startCoord.x + 0.5*Number(startElem.getAttribute('width')) - svgLeft;    // x = left offset + 0.5*width - svg's left offset
        var startY = startCoord.y  + Number(startElem.getAttribute('height')) - svgTop;        // y = top offset + height - svg's top offset

            // calculate path's end (x,y) coords
        var endX = endCoord.x + 0.5*Number(endElem.getAttribute('width')) - svgLeft;
        var endY = endCoord.y  - svgTop;

        // call function for drawing the path
        this.drawPath(svg, path, startX, startY, endX, endY);
    }

    private arrow(x1: number, y1: number, x2: number, y2: number, direction?: string, config?: any): void {
        if (config.type === 'indicator') {
        this.svg.append('line')
             .attr('x1', x1)
             .attr('y1', y1)
             .attr('x2', x2)
             .attr('y2', y2)
             .attr('stroke', config.options.stroke)
             .attr('stroke-width', 2)
             .attr('marker-end', 'url(#arrow)')
             .on('click', () => {
                if (config.type === 'indicator') {
                    this.handleCallback('click', config, config.name);
                }
            })
            .call(d3 .drag()
                .on('start', function() {
                    console.log('start');
                })
                .on('drag', function(d) {
                    console.log(d3.event.x);
                    const currentX = d3.event.x;
                    const currentY = d3.event.y;

                    this.setAttribute('x1', currentX);
                    this.setAttribute('x2', currentX + (x2 - x1));

                    this.setAttribute('y1', currentY);
                    this.setAttribute('y2', currentY + (y2 - y1));
                })
            );
        } else {

        this.svg.append('path')
                .attr('id', 'p1')
                .attr("stroke", "#ccc")
                .attr("stroke-width", 2)
                .attr("fill", "none");

        this.connectElements(document.getElementById('svg'), document.getElementById('p1'), document.getElementById('sq-2'), document.getElementById('sq-3'));
        }
    }

    drawShape(config: any): void {
        let flag = true;
        switch (config.shape) {
            case 'square':
                this.square(config.x1, config.y1, config.width, config.height, config);
                break;
            case 'arrow':
                this.arrow(config.x1, config.y1, config.x2, config.y2, config.direction, config);
                break;
            default:
                flag = false;
                break;
        }
        if (flag) {
            this.positionMap[config.name] = config;
            this.positionMap[config.name]['position'] = {
                x1: config.x1,
                y1: config.y1,
                x2: config.x2 ? config.x2 : config.x1 + config.width,
                y2: config.y2 ? config.y2 : config.y1 + config.height
            };
        }
    }
}

