import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { Bureau } from '../../../parametrage/bureau/Bureau';
import { NotificationService } from '../../../notification/notification.service';

@Component({
    selector: 'app-liste-liste-bureau-super-admin',
    templateUrl: './liste-bureau.component.html',
    styleUrls: ['./liste-bureau.component.scss']
})
export class ListeBureauSAComponent implements OnInit {
    submited: boolean = false;
    @Input() superAdminFranchiseId: number = 0;

    constructor(
        private route: ActivatedRoute,
        private menuService: MenuService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.menuService.setMenu([
            ['Super Admin', '/superadmin'],
            ['Agences', ''],
        ]);
        this.route.params.subscribe((params) => {
            if (params.superAdminFranchiseId) {
                this.superAdminFranchiseId = params.superAdminFranchiseId;
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }
}
