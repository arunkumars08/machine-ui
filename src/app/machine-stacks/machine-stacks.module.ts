import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-modal';
import { TabsModule } from 'ngx-bootstrap';

import { NaturalLanguageModule } from '../natural-language/natural-language.module';
import { DrawingBoardModule } from '../drawing-board/drawing-board.module';
import {TreeStructureModule} from '../tree-structure/tree-structure.module';

import { MachineStacksComponent } from './machine-stacks.component';

@NgModule ({
    imports: [
        CommonModule,
        DrawingBoardModule,
        ModalModule,
        TabsModule.forRoot(),
        NaturalLanguageModule,
        TreeStructureModule
    ],
    declarations: [
        MachineStacksComponent
    ],
    exports: [
        MachineStacksComponent,
        TreeStructureModule
    ]
})

export class MachineStacksModule {}
