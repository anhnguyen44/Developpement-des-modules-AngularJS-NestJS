import { Component, OnInit, Injectable } from '@angular/core';

import { LoginService } from '../../resource/user/login.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from '../../resource/validation/validation.service';
import { NotificationService } from '../../notification/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';

@Injectable()
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    loginForm: FormGroup;
    oubliForm: FormGroup;
    token: string = '';
    submitted = false;
    isFormMdpOublie = false;
    champsResetPassword: Map<string, string> = new Map<string, string>([
        ['login', 'L\'email de connexion'],
        ['motDePasse', 'Le mot de passe'],
        ['motDePasseConfirmation', 'La confirmation du mot de passe'],
    ]);

    doResetPassword() {
        this.loginService.doResetPassword(this.f.login.value, this.f.motDePasse.value, this.token).subscribe(data => {
            this.notificationService.setNotification('success', ['Mot de passe modifié.']);
            this.loginService.logIn(this.f.login.value, this.f.motDePasse.value);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    constructor(
        private loginService: LoginService,
        private formBuilder: FormBuilder,
        private router: Router,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private http: HttpClient,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        if (this.loginService.loggedIn()) {
            this.router.navigate(['/dashboard']);
        }

        this.route.params.subscribe((params) => {
            this.token = params.token;
        });

        this.loginForm = this.formBuilder.group({
            login: ['', [Validators.required, Validators.email]],
            motDePasse: ['', [Validators.required, Validators.minLength(6)]],
            motDePasseConfirmation: ['', [Validators.required, Validators.minLength(6)]]
        }, {
                validators: this.validationService.MustMatch('motDePasse', 'motDePasseConfirmation')
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            const errors = this.validationService.getFormValidationErrors(this.loginForm, this.champsResetPassword);
            this.notificationService.setNotification('danger', errors);
            return;
        }

        this.doResetPassword();
    }
}
