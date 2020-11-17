import {ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {tap} from 'rxjs/operators';
import {ElasticSearchService} from '../../elastic-search/elastic-search.service';
import {Observable} from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private elasticSearchService: ElasticSearchService
    ) {
    }

    intercept(
        context: ExecutionContext,
        stream$: Observable<any>): Observable<any> {
        console.log('Before...');
        const now = Date.now();

        return stream$.pipe(
            tap(() => {
                console.log(`After... ${Date.now() - now}ms`)
            }, (err) => {
                console.log(err);
                const data = {
                    date: Date.now(),
                    idUser: (context.switchToHttp().getRequest().user ? context.switchToHttp().getRequest().user.id : 'WS'),
                    nomUser: (context.switchToHttp().getRequest().user ? context.switchToHttp().getRequest().user.nom : 'WS'),
                    prenomUser: (context.switchToHttp().getRequest().user ? context.switchToHttp().getRequest().user.prenom : 'WS'),
                    idFranchisePrincipale: (context.switchToHttp().getRequest().user ? context.switchToHttp().getRequest().user.idFranchisePrincipale : 'WS'),
                    methods: context.switchToHttp().getRequest().route.methods,
                    path: context.switchToHttp().getRequest().originalUrl,
                    body: (context.switchToHttp().getRequest().body ? context.switchToHttp().getRequest().body : null),
                    error: err
                };
                this.elasticSearchService.index('alealog', data);
            })
        )
    }
}
