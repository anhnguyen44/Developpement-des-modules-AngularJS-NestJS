import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClientChantierComponent } from './modal-client.component';

describe('ModalClientChantierComponent', () => {
    let component: ModalClientChantierComponent;
    let fixture: ComponentFixture<ModalClientChantierComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ModalClientChantierComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalClientChantierComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
