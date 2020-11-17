import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDevisCommandeChantierComponent } from './modal-devis-commande.component';

describe('ModalDevisCommandeChantierComponent', () => {
    let component: ModalDevisCommandeChantierComponent;
    let fixture: ComponentFixture<ModalDevisCommandeChantierComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ModalDevisCommandeChantierComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalDevisCommandeChantierComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
