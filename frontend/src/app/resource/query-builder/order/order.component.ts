import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { Order } from './Order';
import { QueryBuild } from '../QueryBuild';

@Component({
    selector: 'app-header-table',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    @Input() headers: Order[];
    @Input() querybuild: QueryBuild;
    @Input() checkbox: boolean = false;
    @Input() allSelected: boolean;
    @Input() defaultOrder: Order;

    @Output() emitQueryBuild = new EventEmitter<QueryBuild>();
    @Output() emitSetAllChecked = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
        if (this.defaultOrder) {
            const ordre = this.headers.find(c => c.nom == this.defaultOrder.nom);
            this.order(this.defaultOrder.order, ordre, false);
        }
    }

    order(sens, header, isEmitNeeded: boolean = true) {
        for (const header of this.headers) {
            header.order = '';
        }
        header.order = sens;
        this.querybuild.order = header.nom;
        this.querybuild.sensOrder = sens;
        this.querybuild.pageEnCours = 1;

        if (isEmitNeeded) {
            // Pour pas emit le querybuilder quand on met le defaultOrder, on lui passe false depuis le ngOnInit
            this.emitQueryBuild.emit(this.querybuild);
        }
    }

    checkAll(event) {
        console.log(event.target.checked);
        this.emitSetAllChecked.emit(event.target.checked);
    }
}
