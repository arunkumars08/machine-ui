import { Component, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

import * as joint from 'jointjs';

@Component ({
    selector: 'drawing-board',
    styleUrls: ['./drawing-board.component.less'],
    templateUrl: './drawing-board.component.html'
})

export class DrawingBoardComponent implements AfterViewInit {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    @Output() dblclick = new EventEmitter<string>();
    @Output() link = new EventEmitter<any>();

    private positionMap: any = {};
    private objectMap: any = {};
    private links: any = {};

    private svg: any;
    private board: any;

    private increment = 1;

    // @ViewChild('canvasElement') canvasEl: ElementRef;
    @ViewChild('boardContainer') boardContainer: ElementRef;

    private graph: joint.dia.Graph;
    private paper: joint.dia.Paper;
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

        // this.board = new Raphael(this.boardContainer.nativeElement, 1000, 500);
        this.graph = new joint.dia.Graph;
        const arrowheadShape = 'M 10 0 L 0 5 L 10 10 z';
        this.paper = new joint.dia.Paper({
            el: this.boardContainer.nativeElement,
            width: 500,
            height: 500,
            gridSize: 1,
            model: this.graph,
            defaultLink: new joint.shapes.devs.Link({
                attrs: {
                    '.marker-target': {
                        d: arrowheadShape
                    }
                }
            })
        });

        /** Trial */

        this.graph.on('change:source change:target', (link) => {
            const sourcePort = link.get('source').port;
            const sourceId = link.get('source').id;
            const targetPort = link.get('target').port;
            const targetId = link.get('target').id;
            if (sourceId && targetId) {
                // event.stopPropagation();
                console.log(sourceId, targetId);
                this.links[sourceId] = targetId;
                this.link.emit(this.links);
            }
        });

        this.paper.on('cell:pointerdown', (event) => {
            if (event && event.model && event.model.id) {
                const config: any = this.objectMap[event.model.id];
                if (config) {
                    if (config.type === 'indicator') {
                        this.handleCallback('click', config, config.name);
                    }
                }
            }
        });
        this.paper.on('cell:pointerdblclick', (event) => {
            if (event && event.model && event.model.id) {
                const config: any = this.objectMap[event.model.id];
                if (config) {
                    if (config.type === 'element') {
                        config['modelId'] = event.model.id;
                        this.handleCallback('dblclick', config, config.name);
                    }
                }
            }
        });
        /** Trial */

           
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
                        name: 'sq-' + this.increment ++,
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
        } else if (eventType === 'dblclick') {
            console.log(config.modelId);
            this.dblclick.emit(config.modelId);
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
                name: 'sq-ind',
                type: 'indicator',
                shape: 'square'
            },
            'arrow': {
                x1: 50,
                y1: 10,
                x2: 70,
                y2: 10,
                direction: 'right',
                name: 'ar-ind',
                type: 'indicator',
                options: {
                    stroke: '#000',
                    fill: '#000'
                },
                shape: 'arrow'
            }
        };
        this.drawShape(config['square']);
        // this.drawShape(config['arrow']);
    }

    private square(x1: number, y1: number, width: number, height: number, config?: any): void {
        if (config.type === 'indicator') {
            if (config.shape === 'square') {
                const rect = new joint.shapes.basic.Rect({
                    position: { x: 10, y: 10 },
                    size: { width: 30, height: 30 },
                    attrs: { rect: { fill: '#fff', stroke: '#000' } }
                });
                this.objectMap[rect.id] = {
                    type: config.type,
                    name: config.name,
                    shape: config.shape
                };
                this.graph.addCell(rect);
            }
        } else {
            const square = new joint.shapes.devs.Model({
                position: { x: x1, y: y1 },
                size: { width: width, height: height },
                inPorts: ['in'],
                outPorts: ['out'],
                ports: {
                    groups: {
                        'in': {
                            attrs: {
                                '.port-body': {
                                    fill: '#5f56f1',
                                    r: 5,
                                }
                            }
                        },
                        'out': {
                            attrs: {
                                '.port-body': {
                                    fill: '#5f56f1',
                                    r: 5,
                                }
                            }
                        }
                    }
                },
                attrs: {
                    rect: { fill: '#fff' }
                }
            });
            let notification = new joint.shapes.basic.Rect({
                position: { x: x1 + width - 10, y: y1 },
                size: { width: 20, height: 20 },
                attrs: { text: { text: '1', fill: '#fff' }, rect: { fill: 'GREEN' } }
            });
            notification = null;
            this.graph.addCell(square);
            // square.embed(notification);
            this.objectMap[square.id] = {
                type: config.type,
                name: config.name,
                shape: config.shape
            };
        }
    }

    private arrow(x1: number, y1: number, x2: number, y2: number, direction?: string, config?: any): void {
        
    }

    private join(from: string, to: string): void {
        const first = this.objectMap[from];
        const second = this.objectMap[to];

        if (first && second) {
            const link1 = new joint.dia.Link({
                source: first,
                target: second,
                attrs:  {
                    '.connection': { 'stroke-width': 2 },
                    '.marker-source': { d: 'M 0 0 a 5 5 0 1 0 0 1', 'stroke-width': 0, fill: '#232E78' },
                    '.marker-target': { d: 'M 10 -5 10 5 0 0 z', 'stroke-width': 0, fill: '#232E78' }
                }
            });
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

