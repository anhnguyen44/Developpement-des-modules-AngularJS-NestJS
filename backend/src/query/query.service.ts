import { Injectable } from '@nestjs/common';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import {RendezVous} from '../rendez-vous/rendez-vous.entity';

@Injectable()
export class QueryService {
    constructor() { }

    parseQuery(query: SelectQueryBuilder<any>, inQuery) {
        // console.log(inQuery)
        if (inQuery) {
            if ('simple' in inQuery && inQuery.simple !== 'undefined') {
                let value = inQuery.simple.split('€€')[1];
                if (value && value !== 'undefined') {
                    // console.log(value);
                    let searches = inQuery.simple.split('€€')[0].split('$$');
                    searches = searches.filter(function (el) {
                        return el != '';
                    });
                    // console.log(searches);
                    query.andWhere(new Brackets(subQ => {
                        for (const [index, search] of searches.entries()) {
                            if (index === 0) {
                                subQ.where(search + ' LIKE :' + search, { [search]: '%' + value + '%' })
                            } else {
                                subQ.orWhere(search + ' LIKE :' + search, { [search]: '%' + value + '%' })
                            }
                        }
                    }))
                }
            }
            if ('complexe' in inQuery) {
                let searches = inQuery.complexe.split('$$');
                for (let search of searches) {
                    let value = search.split('€€');
                    if (value[1] && value[1] !== 'undefined') {
                        if (value[0].split('.').slice(-1)[0].startsWith('id')) {
                            query.andWhere(value[0] + ' = :' + value[0], { [value[0]]: value[1] })
                        } else {
                            query.andWhere(value[0] + ' LIKE :' + value[0], { [value[0]]: '%' + value[1] + '%' })
                        }
                    }
                }
            }

            if ('idParent' in inQuery && 'nomCleParent' in inQuery) {
                query.andWhere(inQuery.nomCleParent + ' = :idParent', { idParent: inQuery.idParent })
            }

            if ('idStatut' in inQuery && 'nomCleStatut' in inQuery) {
                query.andWhere(inQuery.nomCleStatut + ' = :idStatut', { idStatut: inQuery.idStatut })
            }

            if ('idsExclude' in inQuery && 'nomCleExclude' in inQuery) {
                let ids = inQuery.idsExclude.split('$$');
                ids = ids.filter(function (el) {
                    return el != '';
                });
                query.andWhere(inQuery.nomCleExclude + ' NOT IN (:ids)', {ids: ids})
            }

            if ('idsWhereIn' in inQuery && 'nomCleWhereIn' in inQuery) {
                let ids = inQuery.idsWhereIn.split('$$');
                ids = ids.filter(function (el) {
                    return el != '';
                });
                query.andWhere(inQuery.nomCleWhereIn + ' IN (:ids)', {ids: ids})
            }

            if ('nomCleIsNull' in inQuery) {
                query.andWhere(inQuery.nomCleIsNull + ' IS NULL')
            }

            if ('parPage' in inQuery && 'pageEnCour' in inQuery) {
                query.take(Number(inQuery.parPage)).skip((Number(inQuery.pageEnCour) - 1) * Number(inQuery.parPage))
            }

            if ('order' in inQuery && 'sensOrder' in inQuery) {
                query.orderBy(inQuery.order, inQuery.sensOrder)
            }
        }
        return query
    }

}
