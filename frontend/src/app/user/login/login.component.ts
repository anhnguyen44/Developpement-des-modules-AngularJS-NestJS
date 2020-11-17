import { Component, OnInit, Injectable } from '@angular/core';

import { LoginService } from '../../resource/user/login.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../../resource/validation/validation.service';
import { NotificationService } from '../../notification/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';

@Injectable()
@Component({
    selector: 'app-user-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    oubliForm: FormGroup;
    captchaResponse: string = '';
    submitted = false;
    isFormMdpOublie = false;
    displayCarousel = true;
    champsLogin: Map<string, string> = new Map<string, string>([
        ['login', 'L\'email de connexion'],
        ['motDePasse', 'Le mot de passe'],
        ['recaptchaReactive', 'La sécurité anti-spam'],
    ]);

    doLogin() {
        this.loginService.logIn(this.f.login.value, this.f.motDePasse.value);
        this.displayCarousel = false;
    }

    constructor(
        private loginService: LoginService,
        private formBuilder: FormBuilder,
        private router: Router,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private http: HttpClient
    ) { }

    ngOnInit() {
        if (this.loginService.loggedIn()) {
            this.router.navigate(['/dashboard']);
            this.displayCarousel = false;
        }

        this.loginForm = this.formBuilder.group({
            login: ['', [Validators.required, Validators.email]],
            motDePasse: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.oubliForm = this.formBuilder.group({
            login: ['', [Validators.required, Validators.email]],
            recaptchaReactive: new FormControl(null, Validators.required)
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    get fOubli() { return this.oubliForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            const errors = this.validationService.getFormValidationErrors(this.loginForm, this.champsLogin);
            this.notificationService.setNotification('danger', errors);
            return;
        }

        this.doLogin();
    }

    onSubmitOubli() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.oubliForm.invalid) {
            const errors = this.validationService.getFormValidationErrors(this.oubliForm, this.champsLogin);
            this.notificationService.setNotification('danger', errors);
            return;
        }

        this.loginService.askResetPassword(this.oubliForm.get('login')!.value, this.captchaResponse).subscribe(data => {
            console.log(data);
            this.notificationService.setNotification('info', ['Un email vous a été envoyé pour récupérer votre mot de passe.']);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    resolved(captchaResponse: string) {
        if (captchaResponse) {
            this.captchaResponse = captchaResponse;
        } else {
            this.captchaResponse = '';
        }
    }
}
