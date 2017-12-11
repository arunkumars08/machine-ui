

import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NaturalLanguageService } from './natural-language.service';
import { DependencyCheckService } from './dependency-check.service';
import { waitForMap } from '@angular/router/src/utils/collection';


@Component ({
    selector: 'natural-language',
    styleUrls: ['./natural-language.component.less'],
    providers: [NaturalLanguageService, DependencyCheckService],
    templateUrl: './natural-language.component.html'
})

export class NaturalLanguageComponent implements OnInit, OnChanges {

    @Input() input;
    public userInput: string;
    public dependencies: Array<any> = [];
    public suggestions: Array<any> = [];
    public search_key = '';
    public selceted: string;
    public newDepen: Array<any> = [];

    public serviceName = '';
    public addPackages: Array<any> = [];
    public conflictPackages:Array<any> = ["C"];
    public neverUsedPackages:Array<any> = ["A"];
    
    @Output('submit') submit = new EventEmitter();
    @Output('onContainerEntry') onContainerEntry = new EventEmitter();

    private masterTagsList: Array<string> = ['tag1', 'tag2', 'tag3'];
    private temp: Array<string> = [];
    private _flag = false;

    public addMore = false;
    public inputs: Array<string> = [];

    public tags: any = {};
    public addTag = false;
    constructor(private naturalLanguageService: NaturalLanguageService, 
                private dependencyCheckService: DependencyCheckService) {}

    processNaturalLanguage(): void {
        const naturalLanguage: Observable<any> = this.naturalLanguageService.getPackages(this.userInput);
        if (this.userInput) {
            naturalLanguage.subscribe((data) => {
                console.log(data);
                if (data) {
                    data['dependencies'].map((d) => d['checked'] = true);
                    this.dependencies = data['dependencies'];
                }
            });
            if (this.userInput.indexOf('aws') !== -1) {
                this.onContainerEntry.emit('aws');
            } else {
                this.onContainerEntry.emit('openshift');
            }
        }
    }

    getDeploymentConfig(inputString: string): void{
        // if (inputString.toLowerCase().indexOf('openshift') >= 0){
        //     this.dependencyCheckService.filter('openshift');
        // }else if (inputString.toLowerCase().indexOf('aws') >= 0){
        //     this.dependencyCheckService.filter('aws');
        // }

    }
    processAddPackages(): void {
            const dep: Observable<any> = this.dependencyCheckService.checkPackages(this.tags);
            dep.subscribe((data) => {
                if (data) {
                    if (data['dependencies'] && data['dependencies'].length > 0) {
                        data['dependencies'].map((d) => d['checked'] = false);
                        data['dependencies'].map((d) => {
                            if(this.conflictPackages.indexOf(d["name"]) >= 0){
                                d['message'] = 'This package has dependency issue with above packages.';
                            }else if(this.neverUsedPackages.indexOf(d["name"]) >= 0){
                                d['message'] = 'This package does not usually use with above packages.';
                            }else{
                                d['message'] = null;
                            }
                        });
                        
                        this.addPackages.push(...data['dependencies']);
                    }
                }
            });
        }

    getTags(dependency: any): string {
        if (dependency && dependency.topic_list){
            if (dependency.topic_list.length === 0){
                return '-';
           }
           else {
            return dependency.topic_list.join(', <br />');
           }
        }
    }

    getUsedBy(dependency: any): string {
        let usedBy: Array<any> = dependency.github.used_by;
        usedBy = usedBy.splice(0, 2);
        let someString: string = '';
        usedBy.forEach(u => {
            someString += u.name + '<br />';
        });
        return someString;
    }

    processMasterTags(): void {
        let masterTags: Observable<any> = this.naturalLanguageService.getMasterTags();
        masterTags.subscribe((data) => {
            this.masterTagsList = data.tag_list.sort();
        })
    }

    handleAddMore(): void {
        if (this.inputs && this.inputs.length > 0) {
            const dep: Observable<any> = this.dependencyCheckService.checkPackages(this.inputs);
            dep.subscribe((data) => {
                if (data) {
                    if (data['validation'] && data['validation'].length > 0) {
                        data['validation'].map((d) => d['checked'] = false);
                        this.dependencies.push(...data['validation']);
                    }
                }
            });
        }
    }

    handleSubmit(): void {
        if (this.dependencies && this.dependencies.length > 0) {
            const final: Array<any> = this.dependencies.filter((d) => d['checked'] === true);
            console.log(final);
            const result: any = {
                deps: final,
                sentence: this.userInput
            };
            this.submit.emit({ results: result });
        }
    }

    handleAddTag(): void {
        this.newDepen.push(...this.addPackages.splice(0, 1));
    }

    handleUserInputKeyPress(event: KeyboardEvent): void {
        console.log(event);
        if(this.userInput)
            this.getDeploymentConfig(this.userInput);
        const key: string = event.key;
        if ((key && key.trim() === '@') || (key && this._flag)) {
            if (key === ' ') {
                this._flag = false;
                this.search_key = '';
                this.suggestions = [];
            }else if (key.trim() !== '@') {
                this._flag = true;
                if (key === 'Backspace') {
                    if (this.search_key !== '') {
                        this.search_key = this.search_key.slice(0, -1);
                    }else {
                        this._flag = false;
                        this.suggestions = [];
                    }
                } else {
                    this.search_key += key;
                }
                if (this.search_key){
                this.suggestions = this.masterTagsList.filter((tag) => {
                    return tag.indexOf(this.search_key) !== -1;
                })}
            }else {
                this._flag = true;
            }
            console.log(this.search_key);
        }
    }

    public isCompatible(dependency: string): string{
        // dependency['message'] = '';
        if(this.conflictPackages.indexOf(dependency["name"]) >= 0){
            // dependency['message'] = 'Some tooltip message';
            return `#FAEBD7`;
        } else if(this.neverUsedPackages.indexOf(dependency["name"]) >= 0){
            return `#FFFFE0`;
        }
        return '';
    }

    public handleSuggestionClick(suggestion: any, element: Element): void {
        console.log(suggestion);
        console.log(element);
        let output: any = {};
        output['suggestion'] = suggestion;
        output['element'] = element;
       /* if (output['element'].classList.contains('clicked-suggestion')) {
            output['element'].classList.remove('clicked-suggestion');
            output['status'] = 'removed';
        } else {
            output['element'].classList.add('clicked-suggestion');
            output['status'] = 'added';
        }*/
        // this.onTypeAhead.emit(output);
    }
    ngOnInit(): void {
        this.processAddPackages();
        this.processMasterTags();
    }

    ngOnChanges(): void {
        if (this.input) {
            debugger;
            let data: any = this.input.config.dataset;
            this.userInput = data.sentence;
            this.dependencies = data.dependencies;
            this.serviceName = this.input.name;
            this.dependencies.map(d => d.checked = true);
        }
    }

}
 
