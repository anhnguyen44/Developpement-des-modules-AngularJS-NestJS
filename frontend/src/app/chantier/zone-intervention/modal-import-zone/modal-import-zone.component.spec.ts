import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImportZoneComponent } from './modal-import-zone.component';

describe('ModalImportZoneComponent', () => {
    let component: ModalImportZoneComponent;
    let fixture: ComponentFixture<ModalImportZoneComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ModalImportZoneComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalImportZoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
