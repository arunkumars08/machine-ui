import { Component, ViewChild } from '@angular/core';
import {TreeNode} from 'primeng/components/common/treenode';
import {TreeService} from './tree-structure.service';

@Component ({
    selector: 'tree-table',
    styleUrls: ['./tree-structure.component.less'],
    providers: [TreeService],
    templateUrl: './tree-structure.component.html'
})

export class TreeStructureComponent {

    public files: TreeNode[];

    constructor(private treeService: TreeService) {}

    ngOnInit() {
        this.treeService.getFileSystem().then(files => this.files = files);
    }

}
