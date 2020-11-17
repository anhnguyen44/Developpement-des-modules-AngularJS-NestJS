import { Injectable } from '@angular/core';
import { Recherche } from './recherche/Recherche';
import { QueryBuild } from './QueryBuild';

@Injectable({
    providedIn: 'root'
})
export class QueryService {

    constructor() { }

    parseQuery(queryBuild?: QueryBuild): string {
        let query = '';
        if (queryBuild) {
            if (queryBuild.pageEnCours && queryBuild.parPage) {
                query += this.checkStart(query);
                query += 'parPage=' + queryBuild.parPage;
                query += '&pageEnCour=' + queryBuild.pageEnCours;
            }

            if (queryBuild.sensOrder && queryBuild.order) {
                query += this.checkStart(query);
                query += 'order=' + queryBuild.order;
                query += '&sensOrder=' + queryBuild.sensOrder;
            }

            if (queryBuild.stringRecherche && queryBuild.type) {
                query += this.checkStart(query);
                query += queryBuild.stringRecherche;
            }

            if (queryBuild.dd && queryBuild.df && queryBuild.ddColonne && queryBuild.dfColonne) {
                query += this.checkStart(query);
                query += 'dd=' + queryBuild.dd;
                query += '&ddColonne=' + queryBuild.ddColonne;
                query += '&df=' + queryBuild.df;
                query += '&dfColonne=' + queryBuild.dfColonne;
                query += '&colonne=' + queryBuild.colonne;
            }

            if (queryBuild.dd && queryBuild.df && !queryBuild.ddColonne && !queryBuild.dfColonne) {
                query += this.checkStart(query);
                query += 'dd=' + queryBuild.dd;
                query += '&df=' + queryBuild.df;
            }

            if (queryBuild.idParent && queryBuild.nomCleParent) {
                query += this.checkStart(query);
                query += 'idParent=' + queryBuild.idParent;
                query += '&nomCleParent=' + queryBuild.nomCleParent;
            }

            if (queryBuild.nomCleExclude && queryBuild.idsExclude && queryBuild.idsExclude.length > 0) {
                query += this.checkStart(query);
                query += 'idsExclude=';
                for (const object of queryBuild.idsExclude) {
                    query += '$$' + object.id;
                }
                query += '&nomCleExclude=' + queryBuild.nomCleExclude;
            }

            if (queryBuild.nomCleIsNull) {
                query += this.checkStart(query);
                query += 'nomCleIsNull=' + queryBuild.nomCleIsNull;
            }

            if (queryBuild.idStatut && queryBuild.nomCleStatut) {
                query += this.checkStart(query);
                query += 'idStatut=' + queryBuild.idStatut;
                query += '&nomCleStatut=' + queryBuild.nomCleStatut;
            }
            if (queryBuild.idStatut && queryBuild.nomCleStatut) {
                query += this.checkStart(query);
                query += 'idStatut=' + queryBuild.idStatut;
                query += '&nomCleStatut=' + queryBuild.nomCleStatut;
            }
            if (queryBuild.nonPreleve) {
                query += this.checkStart(query);
                query += 'nonPreleve=' + queryBuild.nonPreleve;
            }
            if (queryBuild.nomCleWhereIn && queryBuild.idsWhereIn && queryBuild.idsWhereIn.length > 0) {
                query += this.checkStart(query);
                query += 'idsWhereIn=';
                for (const object of queryBuild.idsWhereIn) {
                    query += '$$' + object.id;
                }
                query += '&nomCleWhereIn=' + queryBuild.nomCleWhereIn;
            }
        }
        return query;
    }

    checkStart(query) {
        if (query.startsWith('?')) {
            return '&';
        } else {
            return '?';
        }
    }
}
