import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import {
    ZoneIntervention, EnumTypeZoneIntervention, EnumStatutOccupationZone, Liste,
    Franchise, EnumConfinement, Environnement, EnumTypeLocal
} from '@aleaac/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { ZoneInterventionService } from '../../../resource/zone-intervention/zone-intervention.service';
import { Chantier } from '@aleaac/shared';
import { Strategie } from '../../../resource/strategie/Strategie';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Batiment } from '@aleaac/shared/src/models/batiment.model';
import { BatimentService } from '../../../resource/batiment/batiment.service';
import { ValidationService } from '../../../resource/validation/validation.service';
import { ListeService } from '../../../resource/liste/liste.service';
import { MateriauZone } from '@aleaac/shared';
import { HorairesOccupationLocaux } from '@aleaac/shared';
import { HorairesOccupationLocauxService } from '../../../resource/horaires-occupation/horaires-occupation.service';
import { ProcessusZone } from '@aleaac/shared/src/models/processus-zone.model';
import { TypeFichierService } from '../../../superadmin/typefichier/type-fichier.service';
import { FichierService } from '../../../resource/fichier/fichier.service';
import { TypeFichier } from '../../../superadmin/typefichier/type-fichier/TypeFichier';
import { EnumTypeFichier } from '@aleaac/shared/src/models/typeFichier.model';
import { Fichier } from '../../../resource/fichier/Fichier';
import { EnvironnementService } from '../../../resource/environnement/environnement.service';
import { LocalUnitaire } from '@aleaac/shared';
import { LocalUnitaireService } from '../../../resource/local-unitaire/local-unitaire.service';
import { PrelevementService } from '../../../prelevement/prelevement.service';

@Component({
    selector: 'app-zone-prelevement',
    templateUrl: './zone-prelevement.component.html',
    styleUrls: ['./zone-prelevement.component.scss']
})
export class ZoneInterventionPrelevementComponent implements OnInit {

    idStrategie: number;
    idChantier: number;
    idZoneIntervention: number;
    @Input() zoneIntervention: ZoneIntervention | null;
    @Input() franchise: Franchise; // Pour les listes enrichissables
    @Input() chantier: Chantier;
    @Input() strategie: Strategie;
    @Input() canEdit: boolean = true;
    @Output() emitZoneNeedReload: EventEmitter<void> = new EventEmitter();
    isPatchValueDone: boolean = false; // Pour les listes enrichissable, il faut savoir si c'est chargé
    isLoadingGenerate: boolean = false;
    isBtnGenererVisible = false;


    typeZone: EnumTypeZoneIntervention;
    enumTypeZone: typeof EnumTypeZoneIntervention = EnumTypeZoneIntervention;
    enumStatutOccupation: typeof EnumStatutOccupationZone = EnumStatutOccupationZone;
    enumConfinement: typeof EnumConfinement = EnumConfinement;

    labelTypeZone: string = 'd\'Intervention';


    informationsForm: FormGroup;
    errorsInformations: string[] = new Array<string>();
    submittedInformations: boolean = false;

    champsInformations: Map<string, string> = new Map<string, string>([
        ['reference', 'La référence'],
        ['libelle', 'Le libellé'],
        ['descriptif', 'Le descriptif'],
        ['statut', 'Le statut d\'occupation'],
        ['batiment', 'Le bâtiment'],
        ['isZoneDefinieAlea', 'La définition de la zone par AléaContrôles'],
        ['isSousAccreditation', 'Le fait que la zone soit sous accréditation'],
        ['commentaire', 'Le commentaire'],
        ['dureeTraitementEnSemaines', 'La durée de traitement'],
        ['confinement', 'Le type de confinement'],
        ['PIC', 'Le plan d\'installation chantier'],
        ['environnements', 'Choisir un environnement'],
    ]);

    constructor(
        private menuService: MenuService,
        private zoneInterventionService: ZoneInterventionService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private prelevementService: PrelevementService,
        private formBuilder: FormBuilder,
    ) {
        this.informationsForm = this.formBuilder.group({
            id: [null, null],
            reference: [, Validators.required],
            libelle: ['', Validators.required],
            descriptif: ['', Validators.required],
            statut: ['', Validators.required],
            batiment: ['', Validators.required],
            isZoneDefinieAlea: [true, null],
            isSousAccreditation: [true, null],
            commentaire: ['', null],
            dureeTraitementEnSemaines: [null, null],
            confinement: [null, null],
            PIC: ['', null],
            nbGrpExtracteurs: [null, null],
            milieu: ['', null],
            environnements: ['', Validators.compose([Validators.required, Validators.pattern('.+')])],
        });
    }

    ngOnInit() {
        this.idStrategie = this.strategie.id;
        this.idZoneIntervention = this.zoneIntervention!.id;
        this.idChantier = this.chantier.id;

        this.checkIfInitPrelPossible();
    }


    private checkIfInitPrelPossible() {
        this.prelevementService.countAllByType('zoneIntervention', this.idZoneIntervention, new QueryBuild()).subscribe(data => {
            this.isBtnGenererVisible = data === 0;
        });
    }

    pad(num: number, size: number): string {
        let s = num + '';
        while (s.length < size) {
            s = '0' + s;
        }
        return s;
    }

    changeOnglet(onglet) {
        this.router.navigate(['chantier', this.idChantier, 'strategie', this.idStrategie, 'edit-zone', this.idZoneIntervention, onglet]);
    }

    // convenience getter for easy access to form fields
    get f() { return this.informationsForm.controls; }

    compareEnum(a, b) {
        return a && b ? (a === b || a.toString() === b.toString() || a.valueOf() === b.valueOf()) : false;
    }

    compare(a, b) {
        return a && b ? a.id === b.id : false;
    }

    unlockPrlvmntModifiers() {
        if (confirm('Êtes-vous sûr de vouloir dévérouiller ce champ ? Cela va nécessiter un nouveau calcul des prélèvements.')) {
            alert('C\'est pas encore codé, sorry');
        }
    }

    genererPrelevements() {
        console.log(this.zoneIntervention);
        if (this.zoneIntervention!.materiauxZone && this.zoneIntervention!.materiauxZone.length
            && ((this.zoneIntervention!.type == EnumTypeZoneIntervention.ZH && this.zoneIntervention!.nbPiecesUnitaires > 0)
                || (this.zoneIntervention!.type == EnumTypeZoneIntervention.ZT && this.zoneIntervention!.processusZone.length))) {
            this.isLoadingGenerate = true;
            this.zoneInterventionService.genererPrelevements(this.idZoneIntervention).subscribe(() => {
                this.notificationService.setNotification('success', ['Prélèvements générés.']);
                this.emitZoneNeedReload.emit();
                this.isLoadingGenerate = false;
            }, err => {
                this.isLoadingGenerate = false;
            });
        } else {
            if (this.zoneIntervention!.type == EnumTypeZoneIntervention.ZH) {
                this.notificationService.setNotification('danger', ['Il faut saisir au moins un matériau amianté et un local unitaire.']);
            } else {
                this.notificationService.setNotification('danger', ['Il faut saisir au moins un matériau amianté et un processus.']);
            }
        }
    }

    refresh() {
        this.checkIfInitPrelPossible();
    }
}
