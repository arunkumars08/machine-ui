import { Component, ViewChild, Input, OnChanges } from '@angular/core';

@Component ({
    selector: 'machine-stacks',
    styleUrls: ['./machine-stacks.component.less'],
    templateUrl: './machine-stacks.component.html'
})

export class MachineStacksComponent implements OnChanges {

    @Input() read;
    public readInput = {}
    public openModal = false;
    private containerMap: any = {};
    private showFinalButton = false;
    private linkMap: any = {};
    private currentElement: string = '';

    public containerType = '';

    public doShowMessage = false;
    public message = '';
    public openNaturalLanguage = false;

    public handleDblClick(event: any): void {
        if (!event.stopPropagation) {
            this.containerMap[event.modeId] = {};
            console.log('HErerererer');
            console.log(event);
            console.log('Ev', event);
            this.currentElement = event;
            this.openNaturalLanguage = true;
            this.openModal = true;
            this.readInput = event.config.read;
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
            console.log(this.containerMap);
        }
        this.doShowMessage = true;
    }

    public handleContainerEntry(event: any): void {
        if (!event.stopPropagation) {
            console.log(event);
            this.containerType = event;
        }
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

    ngOnChanges(): void {
        console.log(this.read);
    }

}
