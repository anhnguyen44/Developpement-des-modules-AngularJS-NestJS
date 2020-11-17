import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'group',
    template: `
    <div class="mypanel">
        <div class="title" (click)="toggle.emit()">
            {{title}}
            <i class="fas" [class.fa-chevron-down]="!opened" [class.fa-chevron-up]="opened" style="float: right;"></i>
            <i *ngIf="isDeletable" class="fas fa-times" style="float: right; color: red; padding-right: .8em;" (click)="emitDeleteGroup(idGroup)"></i>
            <i *ngIf="isEditable" class="fas fa-pencil-alt" style="float: right; padding-right: .25em;" (click)="emitEditGroup(idGroup)"></i>
        </div>
        <div class="body" [ngClass]="{'hidden': !opened}">
            <ng-content></ng-content>
        </div>
    <div>
    `,
    styleUrls: ['accordion.component.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionGroupComponent {

    /**
     * If the panel is opened or closed
     */
    @Input() opened = false;

    /**
     * Text to display in the group title bar
     */
    @Input() title: string;

    /**
     * Utile si groupe deletable
     */
    @Input() idGroup: number;

    @Input() isDeletable: boolean = false;
    @Input() isEditable: boolean = false;

    /**
     * Emitted when user clicks on group titlebar
     * @type {EventEmitter<any>}
     */
    @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
    @Output() deleteGroupById: EventEmitter<number> = new EventEmitter<number>();
    @Output() editGroupById: EventEmitter<number> = new EventEmitter<number>();

    emitDeleteGroup(id: number) {
        this.deleteGroupById.emit(id);
    }

    emitEditGroup(id: number) {
        this.editGroupById.emit(id);
    }
}
