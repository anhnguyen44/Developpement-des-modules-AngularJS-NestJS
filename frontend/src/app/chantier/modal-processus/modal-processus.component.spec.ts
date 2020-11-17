import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcessusComponent } from './modal-processus.component';

describe('ModalProcessusComponent', () => {
    let component: ModalProcessusComponent;
    let fixture: ComponentFixture<ModalProcessusComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ModalProcessusComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalProcessusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
