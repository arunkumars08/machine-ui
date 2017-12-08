import { Component, ViewChild } from '@angular/core';

@Component ({
    selector: 'machine-stacks',
    styleUrls: ['./machine-stacks.component.less'],
    templateUrl: './machine-stacks.component.html'
})

export class MachineStacksComponent {

    private containerMap: any = {};
    public openModal = false;
    private showFinalButton = false;
    private linkMap: any = {};
    private currentElement: string = '';

    public doShowMessage = false;
    public message = '';
    public openNaturalLanguage = false;
    // @ViewChild('naturalLanguageModal') naturalLanguageModal: any;

    public handleDblClick(event: any): void {
        if (!event.stopPropagation) {
            this.containerMap[event] = {};
            console.log('Ev', event);
            this.currentElement = event;
            this.openNaturalLanguage = true;
            this.openModal = true;
            // this.naturalLanguageModal.open();
            this.showFinalButton = true;
        }
    }

    public handleSubmitFChart(): void {
        this.message = 'You have ' + Object.keys(this.containerMap).length + ' containers';
        if (this.linkMap) {
            const linkKeys: Array<string> = Object.keys(this.linkMap);
            this.message += 'and you have linked the container with id(s): <br />';
            linkKeys.forEach((key) => {
                this.message += '<b>Source:</b> ' + key + ', <b>Destination:</b> ' + this.linkMap[key] + '<br />';
            });
        }
        this.doShowMessage = true;
    }

    public handleLinks(event: any): void {
        if (!event.stopPropagation) {
            console.log(event);
            this.linkMap = event;
        }
    }

    public init(): void {

    }

    public handleModalClose(): void {
        console.log(this.containerMap);
        this.openNaturalLanguage = false;
        // this.naturalLanguageModal.close();
        this.openModal = false;
    }

    public handleModalInputSubmit(event: any): void {
        this.containerMap[this.currentElement] = event;
        this.handleModalClose();
    }

}
