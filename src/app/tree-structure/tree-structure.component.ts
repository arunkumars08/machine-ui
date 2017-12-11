import { Component, ViewChild, Input, OnChanges } from '@angular/core';
import {TreeNode} from 'primeng/components/common/treenode';
import {TreeService} from './tree-structure.service';
import { DependencyCheckService } from '../natural-language/dependency-check.service';

@Component ({
    selector: 'tree-table',
    styleUrls: ['./tree-structure.component.less'],
    providers: [TreeService, DependencyCheckService],
    templateUrl: './tree-structure.component.html'
})

export class TreeStructureComponent implements OnChanges {

    @Input('containerType') containerType;

    public files: TreeNode[];
    inputString = "";
    constructor(private dependencyCheckService: DependencyCheckService,
    private treeService: TreeService) {}

    processDeploymentConfig(): void{
        // this.dependencyCheckService.message.subscribe(inputString => this.inputString = inputString);
        this.treeService.getFileSystem(this.containerType).then(files => this.files = files);
    }

    ngOnInit() {
        // this.processDeploymentConfig();
    }

    ngOnChanges() {
        if (this.containerType && this.containerType.trim() !== '') {
            this.processDeploymentConfig();
        }
    }

}
