import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeStructureComponent } from './tree-structure.component';

import { TreeTableModule } from 'primeng/components/treetable/treetable';

@NgModule ({
  imports: [
    CommonModule,
    TreeTableModule
    ],
    declarations: [
        TreeStructureComponent
    ],
    exports: [
        TreeStructureComponent
    ]
})

export class TreeStructureModule {}
