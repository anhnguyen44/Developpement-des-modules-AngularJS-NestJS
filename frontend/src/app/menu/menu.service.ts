import {Injectable, Inject} from '@angular/core';
import {Menu} from './Menu';
import {BehaviorSubject, Observable, from} from 'rxjs';
import {map, share, catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ApiUrl} from '../resource/api-url';
import {NotificationService} from '../notification/notification.service';
import {ResourceService} from '../resource/resource.service';
import {QueryService} from '../resource/query-builder/query.service';
import {IMenuDefini, MenuDefini} from '@aleaac/shared';
import {QueryBuild} from '../resource/query-builder/QueryBuild';


@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private nomMenu: String = 'test';
    private menu: Menu[] = [new Menu('Accueil', '/dashboard')];
    private _menu: BehaviorSubject<Menu[]> = new BehaviorSubject([new Menu('Accueil', '/dashboard')]);
    private _menudefini: BehaviorSubject<MenuDefini> = new BehaviorSubject(new MenuDefini());


    constructor(
        @Inject(ApiUrl) private apiUrl: string,
        private http: HttpClient,
        private notificationService: NotificationService,
        private resourceService: ResourceService,
        private queryService: QueryService
    ) {
    }


    // Set des nom de menus dans partie sous-header
    setMenu(menus) {
        this.menu = [];
        for (const menu of menus) {
            this.menu.push(new Menu(menu[0], menu[1]));
        }
        this._menu.next(this.menu);
    }

    setNomMenu(nom) {
        this.nomMenu = nom;
    }

    createProfil(menu: IMenuDefini): Observable<IMenuDefini> {
        const $data = this.http
            .post(this.menuDefiniApi, menu).pipe(
                map((resp: any) => resp.data)
            );
        return $data.pipe(catchError(this.handleError));
    }

    // Methode pour collecter tous des menus de s'afficher
    getAllMenus(queryBuild: QueryBuild): Observable<MenuDefini[]> {
        return this.http.get(this.resourceService.resourcesUrl('menu-defini') + this.queryService.parseQuery(queryBuild)).pipe(
            map((resp: any) => resp.data)
        );
    }

    // getAllMenus(): Observable<MenuDefini[]>{
    //   return <Observable<MenuDefini[]>>this.resourceService .getResources('menu-defini');
    // }

    // Collecter tous menus qui ne sont pas le type de recherche
    getAllMenusNonRecher(): Observable<MenuDefini[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/non-recherche')
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getMenusPricipal(): Observable<MenuDefini[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/principal')
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getMenusPricipalAll(): Observable<MenuDefini[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/principalAll')
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getMenuPricipalPermis(): Observable<MenuDefini[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/principalPermis')
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getAllVisible(): Observable<MenuDefini[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/visible')
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getAllVisibleSansPermis(): Observable<MenuDefini[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/visibleSansPermis')
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    getAllVisiblePermis(): Observable<MenuDefini[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/visiblePermis')
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    // createMenu
    createMenu(menu: MenuDefini): Observable<MenuDefini> {
        const $data = this.http
            .post(this.menuDefiniApi, menu).pipe(
                map((resp: any) => resp.data)
            );
        return $data.pipe(catchError(this.handleError));
    }

    getMenuById(id: number): Observable<MenuDefini> {
        return <Observable<MenuDefini>>this.resourceService.getResource(id, 'menu-defini');
    }

    getMenuByUrl(url: string): Observable<MenuDefini> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/menuExpress' + url)
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }

    removeMenu(id: number): Observable<void> {
        return this.resourceService.deleteResource(id, 'menu-defini');
    }

    updateMenu(menu: MenuDefini): Observable<MenuDefini> {
        return <Observable<MenuDefini>>this.resourceService.updateResource(menu, 'menu-defini');
    }

    getAllMenuParMenuId(menuId: number): Observable<MenuDefini[]> {
        const $data = this.http
            .get(this.resourceService.resourcesUrl('menu-defini') + '/menuByMenuId/' + menuId)
            .pipe(
                map((resp: any) => resp.data),
                share()
            );
        return $data.pipe(
            catchError(this.handleError)
        );
    }


    // ===========================================================
    get menus(): Observable<Menu[]> {
        return this._menu.asObservable();
    }

    // Methode handleError
    private handleError = (errorResp: any): Promise<any> => {
        // TODO: don't propagete errors, e.g. post profil...
        const error = errorResp.error ? errorResp.error.message : errorResp.statusText || 'An error ocurred';
        this.notificationService.setNotification('danger', [error]);
        return Promise.reject(error);
    }

    private get menuDefiniApi(): string {
        return this.apiUrl + '/menu-defini';
    }

    get menudefini(): Observable<MenuDefini> {
        return this._menudefini.asObservable();
    }

}
