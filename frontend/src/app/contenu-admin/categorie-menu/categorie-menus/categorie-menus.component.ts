import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../../menu/menu.service';
import {QueryBuild} from '../../../resource/query-builder/QueryBuild';
import {NotificationService} from '../../../notification/notification.service';
import {MenuDefini, CategorieMenu} from '@aleaac/shared';
import {FormBuilder, Validators} from '@angular/forms';
import {ValidationService} from '../../../resource/validation/validation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CategorieMenuService} from '../../../resource/menu/categorie-menu.service';

@Component({
    selector: 'app-categorie-menus',
    templateUrl: './categorie-menus.component.html',
    styleUrls: ['./categorie-menus.component.scss']
})
export class CategorieMenusComponent implements OnInit {

    id: number;
    listeMenus: MenuDefini[];
    submitedCate: boolean = false;
    errorCate: string[] = new Array<string>();
    cateCreate: CategorieMenu;
    compareFn = this._compareFn.bind(this);
    urlCate: string;


    constructor(
        private menuService: MenuService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        private route: ActivatedRoute,
        private categorieMenuService: CategorieMenuService,
        private router: Router
    ) {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            console.log(this.id);
        });
    }

    queryBuild: QueryBuild = new QueryBuild();

    cateForm = this.formBuilder.group({
        id: [null, null],
        menu: ['', [Validators.required]],
        titre: ['', [Validators.required]],
        url: ['', [Validators.required]],
        ordre: ['', null],
    });

    champsCate: Map<string, string> = new Map<string, string>([
        ['menu', 'Le menu de categorie'],
        ['titre', 'Le titre de categorie'],
        ['url', 'Le url de categorie']
    ]);

    ngOnInit() {
        this.menuService.setMenu([
            ['Admin de contenu', '/contenu-admin'],
            ['Categorie', '/contenu-admin/catogorie-menu/liste-categorie'],
            ['Nouveau Categorie', '']
        ]);
        this.menuService.getAllMenus(this.queryBuild).subscribe((data) => {
            this.listeMenus = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
        });

        if (!this.id) {
            this.cateCreate = new CategorieMenu();
        } else {
            this.categorieMenuService.getCateById(this.id).subscribe(menuId => {
                this.cateCreate = menuId;
                console.log(this.cateCreate);
                this.InitForms();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
            });
        }
    }

    getAll() {

    }

    validationCate() {
        this.submitedCate = true;

        if (this.cateForm.invalid) {
            this.errorCate = [];
            this.errorCate = this.validationService.getFormValidationErrors(this.cateForm, this.champsCate);
            this.notificationService.setNotification('danger', this.errorCate);
            return false;
        }
        return true;
    }

    onSubmitCate() {
        if (!this.validationCate()) {
            return;
        }
        // ==== Retourne des variables de forms au variable de objet classe
        console.log(this.cateForm.value);

        // this.cateCreate = { ...this.cateCreate, ...this.cateForm.value };

        if (!this.id) {
            this.categorieMenuService.createCategorieMenu(this.cateForm.value).subscribe((dataCate) => {
                this.notificationService.setNotification('success', ['Categorie crée.']);
                this.router.navigate(['/contenu-admin', 'catogorie-menu', 'liste-categorie']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
            });
        } else {
            this.categorieMenuService.updateCategorieMenu(this.cateForm.value).subscribe((dataUpCate) => {
                this.notificationService.setNotification('success', ['Categorie mis à jour.']);
                this.router.navigate(['/contenu-admin', 'catogorie-menu', 'liste-categorie']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
            });
        }
    }

    setUrlMenu() {
        const url = this.cateForm.value.menu.url;
        const titreValue = this.escapeRegExp(this.cateForm.value.titre);
        if (titreValue) {
            if (url) {
                this.cateForm.controls['url'].setValue(url + '/' + titreValue);
            } else {
                this.cateForm.controls['url'].setValue('/' + titreValue);
            }
        } else {
            if (url) {
                this.cateForm.controls['url'].setValue(url);
            } else {
                this.cateForm.controls['url'].setValue('');
            }
        }
    }

    titreToUrl(s: string) {
        s = this.escapeRegExp(s);
        const urlMenu = this.cateForm.value.menu.url;
        if (!urlMenu) {
            if (s) {
                this.cateForm.controls['url'].setValue('/' + s);
                return '/' + s;
            }
            return;
        } else {
            if (s) {
                this.cateForm.controls['url'].setValue(urlMenu + '/' + s);
                return urlMenu + '/' + s;
            } else {
                this.cateForm.controls['url'].setValue(urlMenu);
                return urlMenu;
            }
        }
    }

    escapeRegExp(s: string) {
        s = s.toLowerCase();
        s = s.split(' ').join('-');
        s = s.replace(/è|é|ê/g, 'e');
        s = s.replace(/à/g, 'a');
        s = s.replace(/ô/g, 'o');
        s = s.replace(/û/g, 'u');
        s = s.replace(/ç/g, 'c');
        s = s.replace(/'/g, '-');
        s = s.trim();
        return s;
    }

    private InitForms() {
        this.cateForm.patchValue(this.cateCreate!);
    }

    get f() {
        return this.cateForm.controls;
    }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }

}
