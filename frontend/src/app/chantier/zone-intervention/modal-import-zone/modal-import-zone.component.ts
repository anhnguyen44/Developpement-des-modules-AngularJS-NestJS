import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { ZoneIntervention } from '@aleaac/shared';
import { ActivatedRoute } from '@angular/router';
import { ZoneInterventionService } from '../../../resource/zone-intervention/zone-intervention.service';

@Component({
    selector: 'app-modal-import-zone',
    templateUrl: './modal-import-zone.component.html',
    styleUrls: ['./modal-import-zone.component.scss']
})
export class ModalImportZoneComponent implements OnInit {
    @Input() callingStrategieId: number;

    @Output() emitZone = new EventEmitter<ZoneIntervention>();
    @Output() emitClose = new EventEmitter();

    constructor(
        private zoneInterventionService: ZoneInterventionService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {

    }

    setZone(zone: ZoneIntervention) {
        this.emitZone.emit(zone);
    }

    close(event) {
        if (!event || !event.srcElement
            || (event.srcElement!.classList[0] !== 'link'
                && event.srcElement!.classList[0] !== 'button'
                && event.srcElement!.classList[0] !== 'sub'
                && event.srcElement!.classList[0] !== 'selection-tache'
                && event.srcElement!.classList[0] !== 'liste-tache'
                && event.srcElement!.classList[0] !== 'tache'
                && event.srcElement!.classList[0] !== 'ng-pristine'
                && event.srcElement!.classList[0] !== 'ng-valid'
                && event.srcElement!.classList[0] !== 'ng-invalid'
                && event.srcElement!.classList[0] !== 'ng-touched'
                && event.srcElement!.classList[0] !== 'ng-untouched'
                && event.srcElement!.classList[0] !== 'formgroup'
                && event.srcElement!.classList[0] !== 'bloc'
            )
        ) {
            this.emitClose.emit();
        }
    }

    onSubmit() {
        // Si valide
        let doNotContinue = false;

    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.emitClose.emit();
    }

    compareEnum(a, b) {
        return a && b ? (a === b || a.toString() === b.toString() || a.valueOf() === b.valueOf()) : false;
    }

    compare(a, b) {
        return a && b ? a.id === b.id : false;
    }
}
