import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { Bureau } from '../../../parametrage/bureau/Bureau';
import { NotificationService } from '../../../notification/notification.service';

@Component({
    selector: 'app-bureau-super-admin',
    templateUrl: './bureau.component.html',
    styleUrls: ['./bureau.component.scss']
})
export class BureauSAComponent implements OnInit {
    submited: boolean = false;
    bureau: Bureau;
    @Input() superAdminFranchiseId: number;
    @Input() superAdminId: number;

    constructor(
        private route: ActivatedRoute,
        private menuService: MenuService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.menuService.setMenu([
            ['Super Admin', '/superadmin'],
            ['Agences', '/superadmin/bureau'],
            ['Informations', '']
        ]);
        this.route.params.subscribe((params) => {
            console.log(params)
            if (params.superAdminId) {
                this.superAdminId = params.superAdminId;
            }
            if (params.superAdminFranchiseId) {
                this.superAdminFranchiseId = params.superAdminFranchiseId;
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }
}
