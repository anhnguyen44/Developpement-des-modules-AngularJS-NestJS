import {AfterContentInit, AfterViewChecked, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {Franchise} from '../../resource/franchise/franchise';
import {Consommable} from '../Consommable';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {ConsommableService} from '../consommable.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {Router} from '@angular/router';
import {Pompe} from '../Pompe';
import {PompeService} from '../pompe.service';
import {EnumTypePompe} from '@aleaac/shared';
import {RendezVous} from '../RendezVous';
import {format} from 'date-fns';
import {RendezVousPompe} from '../RendezVousPompe';

@Component({
  selector: 'app-liste-pompe',
  templateUrl: './liste-pompe.component.html',
  styleUrls: ['./liste-pompe.component.scss']
})
export class ListePompeComponent implements OnInit {
    @Input() modal = false;
    @Input() pompesAjoutees: RendezVousPompe[];
    @Output() emitPompe = new EventEmitter<Pompe>();
    @Input() idBureau: number | null;
    @Input() rendezVous: RendezVous | null;
    nbObjets: number = 10;
    enumTypePompe = EnumTypePompe;
    franchise: Franchise;
    pompes: Pompe[];
    champDeRecherches: ChampDeRecherche[] = [];
    headers: Order[] = [
        new Order('Libellé', '', true, 'pompe.libelle'),
        new Order('Référence', '', true, 'pompe.ref'),
        new Order('Type', '', false),
        new Order('Agence', '', true, 'bureau.nom'),
        new Order('Action', 'action'),
    ];
    queryBuild: QueryBuild = new QueryBuild();

    constructor(
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private pompeService: PompeService,
        private bureauService: BureauService,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.pompesAjoutees) {
            const pompes: Pompe[] = [];
            for (const pompeAjoute of this.pompesAjoutees) {
                pompes.push(pompeAjoute.pompe);
            }
            this.queryBuild.idsExclude = pompes;
            this.queryBuild.nomCleExclude = 'pompe.id';
        }
        if (!this.modal) {
            this.menuService.setMenu([['Logistique', '/logistique/lot-filtre'], ['Pompes', '']]);
        }
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.champDeRecherches = [
                    new ChampDeRecherche('Libellé', 'text', 'pompe.libelle', true, true),
                    new ChampDeRecherche('Référence', 'text', 'pompe.ref', true, true),
                    new ChampDeRecherche('Type', 'enum', 'pompe.idTypePompe', false, true, EnumTypePompe),
                    new ChampDeRecherche('Agence', 'list', 'pompe.idBureau', false, true, bureaux.map((bureau) => {
                        return {id: bureau.id, nom: bureau.nom};
                    })),
                ];
            });
        });
    }

    getAll() {
        if (this.idBureau) {
            if (this.rendezVous) {
                this.queryBuild.dd = format(this.rendezVous.dateHeureDebut, 'YYYY-MM-DD HH:mm:ss');
                this.queryBuild.df = format(this.rendezVous.dateHeureFin, 'YYYY-MM-DD HH:mm:ss');
            }
            this.pompeService.getByBureau(this.idBureau, this.queryBuild).subscribe((pompes) => {
                this.pompes = pompes;
            });
        } else {
            this.pompeService.getAll(this.franchise.id, this.queryBuild).subscribe((pompes) => {
                this.pompes = pompes;
            });
        }
    }

    countAll() {
        if (this.idBureau) {
            this.pompeService.countByBureau(this.idBureau, this.queryBuild).subscribe((nombre) => {
                this.nbObjets = nombre;
            });
        } else {
            this.pompeService.countAll(this.franchise.id, this.queryBuild).subscribe((nombre) => {
                this.nbObjets = nombre;
            });
        }
    }

    setQueryBuild(queryBuild: QueryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countAll();
        }
        this.getAll();
    }

    goToDetail(pompe) {
        if ( this.modal ) {
            this.emitPompe.emit(pompe);
        } else {
            this.router.navigate(['/logistique', 'pompe', 'modifier', pompe.id]);
        }

    }
}
