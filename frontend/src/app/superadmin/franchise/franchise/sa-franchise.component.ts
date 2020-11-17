import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Franchise } from '../../../resource/franchise/franchise';
import { MenuService } from '../../../menu/menu.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { UserService } from '../../../resource/user/user.service';
import { UserStore } from '../../../resource/user/user.store';
import { ValidationService } from '../../../resource/validation/validation.service';
import { NotificationService } from '../../../notification/notification.service';

@Component({
  selector: 'sa-franchise',
  templateUrl: './sa-franchise.component.html',
  styleUrls: ['./sa-franchise.component.scss']
})
export class SAFranchiseComponent implements OnInit {
  superAdminId: number;

  constructor(
    private menuService: MenuService,
    private franchiseService: FranchiseService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private userStore: UserStore,
    private validationService: ValidationService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.superAdminId = params['id'];
      console.log(this.superAdminId);
      if (!this.superAdminId) {
        this.superAdminId = 0;
      }
      this.menuService.setMenu([
        ['Super Admin', '/superadmin'],
        ['Franchises', '/superadmin/franchise/liste'],
        ['Info franchise', '']
      ]);
    });
  }
}
