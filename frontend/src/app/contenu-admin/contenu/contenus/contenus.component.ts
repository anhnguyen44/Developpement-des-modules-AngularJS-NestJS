import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {MenuService} from '../../../menu/menu.service';
import {
    MenuDefini,
    CategorieMenu,
    IDroit,
    ContenuMenu,
    IContenuMenu,
    EnumTypeFichierGroupe,
    EnumTypeFichier,
    IFichier
} from '@aleaac/shared';
import {QueryBuild} from '../../../resource/query-builder/QueryBuild';
import {NotificationService} from '../../../notification/notification.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CategorieMenuService} from '../../../resource/menu/categorie-menu.service';
import {DroitService} from '../../../resource/droit/droit.service';
import {ValidationService} from '../../../resource/validation/validation.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ContenuMenuService} from '../../../resource/menu/contenu-menu.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {Fichier} from '../../../resource/fichier/Fichier';
import {TypeFichier} from '../../../superadmin/typefichier/type-fichier/TypeFichier';
import {TypeFichierService} from '../../../superadmin/typefichier/type-fichier.service';
import {FichierService} from '../../../resource/fichier/fichier.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-contenus',
    templateUrl: './contenus.component.html',
    styleUrls: ['./contenus.component.scss']
})
export class ContenusComponent implements OnInit {

    @Output() emitFichier: EventEmitter<Fichier> = new EventEmitter<Fichier>();

    // public Editor = ClassicEditor;
    public config = {
        language: 'fr',
        contentsCss: './contenus.component.scss',
        ckfinder: {
            options: {
                resourceType: 'Images'
            },
            uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
        }
    };


    fileData = null;
    id: number;
    idImg: number;
    submitedContenu: boolean = false;
    listeMenus: MenuDefini[];
    activeCateList: boolean = false;
    listeCates: CategorieMenu[];
    listeDroit: IDroit[];
    errorsCate: string[] = new Array<string>();
    contenuCreate?: ContenuMenu;
    compareFn = this._compareFn.bind(this);
    modalFichier: boolean = false;

    fichiers: Fichier[];
    groupeTypeFicher: EnumTypeFichierGroupe = EnumTypeFichierGroupe.CHANTIER;
    TypeFichier: TypeFichier;
    image: Fichier;
    urlImage: string = 'none';
    content: string;

    public progress: number;
    public message: string;
    // @Output() public onUploadFinished = new EventEmitter();

    contenuForm = this.formBuilder.group({
        id: [null, null],
        menu: ['', [Validators.required]],
        categorie: ['', null],
        expression: ['', [Validators.required]],
        titre: ['', null],
        libelleLien: ['', null],
        header1: ['', null],
        header2: ['', null],
        intro: ['', [Validators.required]],
        contenu: ['', null],
        miniature: ['', null],
        ordre: ['', null],
        metaDescription: ['', [Validators.required]],
        visible: ['', null],
        permission: [null],
        tag: ['', null],
        dateAjout: ['', null],
        dateMisAJour: ['', null]
    });

    champsContenu: Map<string, string> = new Map<string, string>([
        ['menu', 'Le menu de contenu'],
        ['expression', 'Le expression de contenu'],
        ['intro', 'Le introduction de contenu'],
        ['metaDescription', 'Le meta description de contenu'],
    ]);

    constructor(
        private menuService: MenuService,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder,
        private categorieMenuService: CategorieMenuService,
        private droitService: DroitService,
        private validationService: ValidationService,
        private route: ActivatedRoute,
        private contenuMenuService: ContenuMenuService,
        private http: HttpClient,
        private typeFichierService: TypeFichierService,
        private fichierService: FichierService,
        private router: Router
    ) {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }

    queryBuild: QueryBuild = new QueryBuild();

    ngOnInit() {
        this.menuService.setMenu([
            ['Admin de contenu', '/contenu-admin'],
            ['Contenus', '/contenu-admin/contenu/liste'],
            ['Contenu', '']
        ]);

        this.typeFichierService.getAll().subscribe(data => {
            this.TypeFichier = data.find(c => c.id == EnumTypeFichier.CHANTIER_PHOTOS)!;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });


        if (!this.id) {
            this.contenuCreate = new ContenuMenu();
        } else {
            this.contenuMenuService.getContenuById(this.id).subscribe(contenu => {
                if (contenu.miniature) {
                    this.urlImage = environment.api + '/fichier/affiche/' + contenu.miniature!.keyDL;
                }
                this.contenuCreate = contenu;
                this.InitForms();
                this.isActiveSelectCate();
                this.contenuForm.patchValue({categorie: this.contenuCreate!.categorie});
                console.log(this.contenuCreate.contenu);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
            });
        }

        this.menuService.getAllMenus(this.queryBuild).subscribe(data => {
            this.listeMenus = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
        });

        this.droitService.getDroitForMenu().subscribe((data5) => {
            this.listeDroit = data5;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        });
    }


    isActiveSelectCate() {

        const menu = this.contenuForm.get('menu')!.value;
        this.categorieMenuService.getCateParMenuId(menu.id).subscribe(data1 => {
            this.listeCates = data1;
            if (!this.id) {
                this.contenuForm.patchValue({categorie: this.listeCates[0]});
            }
            if (this.listeCates.length > 0) {
                this.activeCateList = true;
            } else {
                this.activeCateList = false;
            }
            // console.log(this.listeCates.length);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
        });
    }

    validateContenu() {
        this.submitedContenu = true;
        this.contenuForm.controls['miniature'].setValue(null);

        if (this.contenuForm.invalid) {
            this.errorsCate = [];
            this.errorsCate = this.validationService.getFormValidationErrors(this.contenuForm, this.champsContenu);
            this.notificationService.setNotification('danger', this.errorsCate);
            return false;
        } else {
            return true;
        }
    }

    onSubmitContenu() {
        if (!this.validateContenu()) {
            console.log('toi day');
            return;
        }

        this.contenuCreate = {...this.contenuCreate, ...this.contenuForm.value};
        console.log('toi day');


        const expres = this.contenuForm.get('expression')!.value;
        if (!this.contenuForm.get('titre')!.value) {
            this.contenuCreate!.titre = expres;
        }
        if (!this.contenuForm.get('libelleLien')!.value) {
            this.contenuCreate!.libelleLien = expres;
        }
        if (!this.contenuForm.get('header1')!.value) {
            this.contenuCreate!.header1 = expres;
        }
        const permission = this.contenuForm.get('permission')!.value;
        if (permission == 'null') {
            this.contenuCreate!.permission = null;
        }

        if (this.content) {
            this.contenuCreate!.contenu = this.content;
        }

        this.contenuCreate!.expression = this.escapeRegExp(expres);


        // if (this.idImg) {
        //     this.fichierService.getFichierById(this.idImg).subscribe(img => {
        //         console.log(this.contenuCreate!.miniature);
        //         this.contenuCreate!.miniature = img;
        //         console.log(img);
        //     }, err => {
        //         this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        //         console.log(err);
        //     });
        // } else {
        //     this.contenuCreate!.miniature = null;
        // }

        if (!this.id) {
            console.log('no id');
            console.log(this.contenuCreate);
            this.contenuCreate!.dateAjout = new Date();
            // this.contenuCreate!.dateMisAJour = new Date();
            if (this.idImg && this.urlImage != 'none') {
                this.contenuCreate!.idMiniature = this.idImg;
            } else {
                this.contenuCreate!.idMiniature = null;
            }

            console.log('create contenu');
            console.log(this.contenuCreate);
            this.contenuMenuService.createContenuMenu(this.contenuCreate!).subscribe((data1) => {
                this.notificationService.setNotification('success', ['Contenu créé.']);
                this.router.navigate(['/contenu-admin', 'contenu', 'liste']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        } else {
            console.log('update');
            if (this.urlImage != 'none') {
                delete this.contenuCreate!.miniature;
                if (this.idImg) {
                    this.contenuCreate!.idMiniature = this.idImg;
                }
            } else {
                delete this.contenuCreate!.miniature;
                this.contenuCreate!.idMiniature = null;
            }

            this.contenuCreate!.dateMisAJour = new Date();
            this.contenuMenuService.updateContenuMenu(this.contenuCreate!).subscribe((dataUp) => {
                this.notificationService.setNotification('success', ['Contenu mis à jour.']);
                this.router.navigate(['/contenu-admin', 'contenu', 'liste']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }

        // console.log(this.contenuCreate);
    }

    closeModalFichier() {
        this.modalFichier = false;
    }

    getIdFichier(id: number) {
        this.idImg = id;
        console.log(id);
        this.closeModalFichier();
        this.importImage(this.idImg);
    }

    importImage(id: number) {
        if (id) {
            this.fichierService.getFichierById(id).subscribe(img => {
                this.urlImage = environment.api + '/fichier/affiche/' + img.keyDL;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
            });
        }
    }

    exportImage() {
        this.urlImage = 'none';
    }

    getContent(s: string) {
        console.log(s);
        this.content = s;
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
        this.contenuForm.patchValue(this.contenuCreate!);
    }

    get f() {
        return this.contenuForm.controls;
    }

    openModalFichier() {
        this.modalFichier = true;
    }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }

}
