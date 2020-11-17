import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Processus} from '../Processus';
import {ProcessusService} from '../processus.service';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {Router} from '@angular/router';
import {MenuService} from '../../menu/menu.service';

@Component({
  selector: 'app-liste-processus',
  templateUrl: './liste-processus.component.html',
  styleUrls: ['./liste-processus.component.scss']
})
export class ListeProcessusComponent implements OnInit {
  @Input() idCompte: number;
  @Output() emitNew = new EventEmitter();
  listProcessus: Processus[];
  headers: Order[] = [
      new Order('Libelle', '', true, 'processus.libelle'),
      new Order('Action', 'action')
  ];
  queryBuild: QueryBuild = new QueryBuild();

  constructor(
      private processusService: ProcessusService,
      private router: Router,
      private menuService: MenuService
  ) { }

  ngOnInit() {
      this.menuService.setMenu([['Comptes / Contacts', '/contact'], ['Processus', '']]);
      this.getAll();
  }

  getAll() {
      this.processusService.getAll(this.idCompte, this.queryBuild).subscribe((processus) => {
          this.listProcessus = processus;
      });
  }

  setQueryBuild(queryBuild: QueryBuild) {
    this.queryBuild = queryBuild;
    this.getAll();
  }

  goTo(processus) {
      this.router.navigate(['/contact/compte', this.idCompte, 'processus', processus.id, 'modifier']);
  }

  nouveauProcessus() {
      this.emitNew.emit();
      this.router.navigate(['/contact/compte', this.idCompte, 'processus', 'ajouter']);
  }

  delete(processus) {
      this.processusService.delete(processus).subscribe(() => {
          this.listProcessus = this.listProcessus.filter((findProcessus) => {
              return findProcessus.id !== processus.id;
          });
      });
  }

}
