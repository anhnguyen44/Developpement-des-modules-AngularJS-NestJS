import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListeChantierComponent } from './modal-liste-chantier.component';

describe('ModalListeChantierComponent', () => {
    let component: ModalListeChantierComponent;
    let fixture: ComponentFixture<ModalListeChantierComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ModalListeChantierComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalListeChantierComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
