

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

export class NaturalLanguageComponent implements OnInit {
    public userInput: string;
    public dependencies: Array<any> = [];
    public suggestions: Array<any> = [];
    public search_key = '';
    public selceted: string;
    public newDepen: Array<any> = [];
    
    @Output('submit') submit = new EventEmitter();

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
        let naturalLanguage: Observable<any> = this.naturalLanguageService.getPackages(this.userInput);
        naturalLanguage.subscribe((data) => {
            console.log(data);
            if (data) {
                data['dependencies'].map((d) => d['checked'] = true);
                this.dependencies = data['dependencies'];
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
            this.submit.emit({ results: final });
        }
    }

    handleAddTag(): void {
        if (this.tags) {
            const dep: Observable<any> = this.dependencyCheckService.checkPackages(this.tags);
            dep.subscribe((data) => {
                if (data) {
                    if (data['dependencies'] && data['dependencies'].length > 0) {
                        data['dependencies'].map((d) => d['checked'] = false);
                        this.newDepen.push(...data['dependencies'].slice(0, 1));
                    }
                }
            });
        }
    }

    handleUserInputKeyPress(event: KeyboardEvent): void {
        console.log(event);
        const key: string = event.key;
        if ((key && key.trim() === '@') || (key && this._flag)) {
            if (key === ' ') {
                this._flag = false;
                this.search_key = '';
                this.suggestions = [];
            }
            else if (key.trim() !== '@') {
                this._flag = true;
                if (key === 'Backspace') {
                    if (this.search_key !== '') {
                        this.search_key = this.search_key.slice(0, -1);
                    }
                    else {
                        this._flag = false;
                        this.suggestions = [];
                    }
                }
                else {
                    this.search_key += key;
                }
                if (this.search_key){
                this.suggestions = this.masterTagsList.filter((tag) => {
                    return tag.indexOf(this.search_key) !== -1
                })}
            }
            else {
                this._flag = true;
            }
            console.log(this.search_key);
        }
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
        this.processMasterTags();
    }

}
 