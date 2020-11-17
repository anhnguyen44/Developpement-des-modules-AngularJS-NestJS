import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcessusZoneComponent } from './modal-processus-zone.component';

describe('ModalProcessusZoneComponent', () => {
    let component: ModalProcessusZoneComponent;
    let fixture: ComponentFixture<ModalProcessusZoneComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ModalProcessusZoneComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalProcessusZoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
