import { Injectable, HttpException } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';
import { QueryService } from '../query/query.service';

@Injectable()
export class ElasticSearchService {
    private readonly esclient: elasticsearch.Client;

    constructor(
        private queryService: QueryService
    ) {
        try {
            this.esclient = new elasticsearch.Client({
                host: 'localhost:9200',
            });
            this.esclient.ping({ requestTimeout: 3000 })
                .catch(err => {
                    console.warn(err);
                });
        } catch (err) {
            console.log(err);
        }

    }

    async index(index: string, data: any) {
        try {
        return await this.esclient.index({
            body: data,
            index: index,
            id: data.id
        });
        } catch (e) {
            console.log(e)
        }
    }

    async indexByUrl(index: string, data: any) {
        return await this.esclient.index({
            body: data,
            index: index,
            id: data.expression,
        })
    }

    async delete(index: string, id: number) {
        try {
            return await this.esclient.delete({
                index: index,
                id: id
            });
        } catch (e) {
            console.log(e)
        }
    }

    async deleteIndex(index: string) {
        console.log(index);
        try {
            return await this.esclient.indices.delete({
                index: index
            });
        } catch (e) {
            console.log(e)
        }
    }


    /*async bulkInsert(idMenu: number, idContenu: number, data: any) {
        console.log(idMenu);
        const bulk = [];

        bulk.push({
            'create': {_index: 'aleacontenu', _type: idMenu, _id: idContenu}
        });
        bulk.push(data);


        return await this.esclient.bulk({
            'body': bulk,
            'index': 'aleacontenu',
            'type': idMenu
        })
            .then(res => ({status: 'success', data: res}))
            .catch(err => {
                throw new HttpException(err, 500);
            });
    }

    async bulkUpdate(idMenu: number, idContenu, data: any) {
        const bulkUpdate = [];

        bulkUpdate.push({
            'update': {_index: 'aleacontenu', _type: idMenu, _id: idContenu}
        });
        bulkUpdate.push({'doc': data});


        return await this.esclient.bulk({
            'body': bulkUpdate,
            'index': 'aleacontenu',
            'type': idMenu
        })
            .then(res => ({status: 'success', data: res}))
            .catch(err => {
                throw new HttpException(err, 500)
            });
    }

    async bulkDelete(idMenu, idContenu) {
        const bulkDelete = [];

        bulkDelete.push({
            'delete': {_index: 'aleacontenu', _type: idMenu, _id: idContenu}
        });

        return await this.esclient.bulk({
            'body': bulkDelete,
            'index': 'aleacontenu',
            'type': idMenu
        })
            .then(res => ({status: 'success', data: res}))
            .catch(err => {
                throw new HttpException(err, 500)
            });
    }*/

    /*// searches the 'pokemons' index for matching documents
    async searchListContenu(idMenu: number, q: string) {
        console.log('cest querybuild');
        console.log(q);
        const body = {
            size: 200,
            from: 0,
            query: {
                match: {
                    url: q,
                },
            },
        };
        return await this.esclient.search({index: 'aleacontenu', type: idMenu, body, q})
            .then(res => res.hits.hits)
            .catch(err => {
                throw new HttpException(err, 500);
            });
    }*/

    async countElasticSearch(idMenu: number, q: string): Promise<number> {
        let innerBody = {};
        if (q != '') {
            innerBody = {
                query: {
                    bool: {
                        must: [
                            {
                                multi_match: {
                                    type: 'cross_fields',
                                    query: q,
                                    fields: [
                                        'titre',
                                        'intro',
                                        'categorieTire'
                                    ],
                                    operator: 'or',
                                    analyzer: 'standard'
                                }
                            }
                        ]
                    }
                }
            };
        }
        const results = await this.esclient.search({
            index: 'aleacontenu',
            type: idMenu,
            body: innerBody
        });


        return results.hits.total;
        // return results.hits.hits.map(({_source: {id,titre,intro,MiniautureURL}})=>({
        //     id,titre,intro,MiniautureURL
        // }));
    }

    async countElasticSearchUrl(url: string, q: string): Promise<number> {
        let innerBody = {};
        if (q != '') {
            innerBody = {
                query: {
                    bool: {
                        must: [
                            {
                                multi_match: {
                                    type: 'cross_fields',
                                    query: q,
                                    fields: [
                                        'titre',
                                        'intro',
                                        'categorieTire'
                                    ],
                                    operator: 'or',
                                    analyzer: 'standard'
                                }
                            }
                        ]
                    }
                }
            };
        }
        const results = await this.esclient.search({
            index: 'aleacontenu',
            type: url,
            body: innerBody
        });


        return results.hits.total;
        // return results.hits.hits.map(({_source: {id,titre,intro,MiniautureURL}})=>({
        //     id,titre,intro,MiniautureURL
        // }));
    }

    async getElasticAleaContenu(idMenu: number, search: string, queryBuild): Promise<string[]> {

        const results = await this.esclient.search({
            index: 'aleacontenu',
            from: (parseInt(queryBuild['pageEnCour'], 10) - 1) * parseInt(queryBuild['parPage'], 10),
            size: queryBuild['parPage'],
            body: {
                query: {
                    bool: {
                        should: [
                            {
                                match: {
                                    titre: search
                                }
                            },
                            {
                                match: {
                                    intro: search
                                }
                            }
                        ],
                        filter: {
                            term: {
                                idMenu: idMenu
                            }
                        }
                    }
                }
            }
        });

        return await results.hits.hits.map(({ _source: { id, titre, intro, MiniautureURL, dateAjout, expression, categorieTire } }) => ({
            id, titre, intro, MiniautureURL, dateAjout, expression, categorieTire
        }));
    }

    async getElasticAleaContenuUrl(url: string, search: string, queryBuild): Promise<string[]> {

        const results = await this.esclient.search({
            index: 'aleacontenu',
            from: (parseInt(queryBuild['pageEnCour'], 10) - 1) * parseInt(queryBuild['parPage'], 10),
            size: queryBuild['parPage'],
            body: {
                query: {
                    bool: {
                        should: [
                            {
                                match: {
                                    titre: search
                                }
                            },
                            {
                                match: {
                                    intro: search
                                }
                            }
                        ],
                        filter: {
                            term : {
                                url: url
                            }
                        }
                    }
                }
            }
        });

        return await results.hits.hits.map(({_source: {id, titre, intro, MiniautureURL, dateAjout, expression, categorieTire}}) => ({
            id, titre, intro, MiniautureURL, dateAjout, expression, categorieTire
        }));
    }

    async getListElastic(idMenu: number, q: string, queryBuild: string): Promise<string[]> {
        let innerBody = {};
        if (q != '') {
            innerBody = {
                query: {
                    // multi_match : {
                    //     query: q,
                    //     fields: [ 'titre^3', 'intro' ],
                    //     type: 'phrase_prefix',
                    //     operator: 'or',
                    //     tie_breaker: 0.3,
                    //     cutoff_frequency: 0.1,
                    //     analyzer: 'standard'
                    //   }

                    bool: {
                        must: [
                            {
                                multi_match: {
                                    //  type: 'most_fields',
                                    type: 'cross_fields',
                                    //  type: 'phrase_prefix',
                                    query: q,
                                    fields: [
                                        'titre',
                                        'intro',
                                        'categorieTire'
                                    ],
                                    operator: 'or',
                                    analyzer: 'standard',
                                }
                            }
                        ]
                    }
                },


            };
        }
        const results = await this.esclient.search({
            index: 'aleacontenu',
            type: idMenu,
            from: (parseInt(queryBuild['pageEnCour'], 10) - 1) * parseInt(queryBuild['parPage'], 10),
            size: queryBuild['parPage'],
            body: innerBody
        });

        // results = this.queryService.parseQuery(results, queryBuild);


        return await results.hits.hits.map(({ _source: { id, titre, intro, MiniautureURL, dateAjout, expression, categorieTire } }) => ({
            id, titre, intro, MiniautureURL, dateAjout, expression, categorieTire
        }));
    }
}