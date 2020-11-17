import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Franchise } from '@aleaac/shared';
import { FranchiseService } from '../../../resource/franchise/franchise.service';

@Component({
  selector: 'app-page-prelevement-zone',
  templateUrl: './page-prelevement-zone.component.html',
  styleUrls: ['./page-prelevement-zone.component.scss']
})
export class PagePrelevementZoneComponent implements OnInit {
  @Input() application: string = 'zoneIntervention';
  @Input() idParent: number;
  @Input() typePage: string = 'liste';
  @Input() franchise: Franchise;
  @Input() isNew: boolean = false;
  @Input() canEdit: boolean = true;
  @Output() emitRefresh: EventEmitter<void> = new EventEmitter();

  constructor(
    private franchiseService: FranchiseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  refreshParent() {
    this.emitRefresh.emit();
  }
}
