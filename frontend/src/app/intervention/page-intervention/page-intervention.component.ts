import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {InterventionService} from '../intervention.service';
import {Intervention} from '../Intervention';
import {NotificationService} from '../../notification/notification.service';

@Component({
  selector: 'app-page-intervention',
  templateUrl: './page-intervention.component.html',
  styleUrls: ['./page-intervention.component.scss']
})
export class PageInterventionComponent implements OnInit {
  type: string = 'liste';
  idIntervention: number;
  intervention: Intervention;
  isNew: boolean = false;

  constructor(
      private route: ActivatedRoute,
      private interventionService: InterventionService
  ) { }

  ngOnInit() {
    if (this.route.snapshot.url.length === 0) {
      this.type = 'liste';
    } else {
      if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path !== 'ajouter') {
        this.type = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
        this.isNew = false;
      } else {
        this.type = 'information';
        this.isNew = true;
      }
    }

    this.route.params.subscribe((params) => {
      if (params.idIntervention) {
        this.interventionService.get(params.idIntervention).subscribe((intervention) => {
          this.intervention = intervention;
        });
        this.idIntervention = params.idIntervention;
      }
    });
  }

}
