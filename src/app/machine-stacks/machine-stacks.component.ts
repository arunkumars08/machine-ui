import { Component, ViewChild } from '@angular/core';

@Component ({
    selector: 'machine-stacks',
    styleUrls: ['./machine-stacks.component.less'],
    templateUrl: './machine-stacks.component.html'
})

export class MachineStacksComponent {

    private containerMap: any = {};
    public openModal = false;
    // @ViewChild('naturalLanguageModal') naturalLanguageModal: any;

    public handleDblClick(event: any): void {
        this.containerMap[event] = {};
        this.openModal = true;
        // this.naturalLanguageModal.open();
    }

    public handleModalClose(): void {
        // this.naturalLanguageModal.close();
        this.openModal = false;
    }

}
