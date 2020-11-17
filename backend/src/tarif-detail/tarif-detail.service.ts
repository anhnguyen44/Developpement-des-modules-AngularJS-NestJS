import {Injectable} from '@nestjs/common';
import {TarifDetail} from './tarif-detail.entity';
import {Log} from '../logger/logger';
import {FindManyOptions, Repository, DeepPartial, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';
import {Produit} from '../produit/produit.entity';
import {GrilleTarif} from '../grille-tarif/grille-tarif.entity';

@Injectable()
export class TarifDetailService {
    constructor(
        @InjectRepository(TarifDetail)
        private readonly TarifDetailRepository: Repository<TarifDetail>,
        private queryService: QueryService
        // private readonly log: Log
    ) {}

    // Create
  async create(TarifDetailDto: TarifDetail): Promise<TarifDetail> {
    const savedTarifDetail = await this.TarifDetailRepository.save(TarifDetailDto);
    return savedTarifDetail;
  }

  // Read
  async find(findOptions?: FindManyOptions<TarifDetail>): Promise<TarifDetail[]> {
    const options: FindManyOptions<TarifDetail> = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} users with an offset of ${options.skip} ...`);
    const result = await this.TarifDetailRepository.find(options);
    return result;
  }

  async findOneById(id: number): Promise<TarifDetail> {
    // this.log.debug('trying to find one user by id...');
      const result = await this.TarifDetailRepository.findOne({
        id: id
      });
      return result;
  }

  async findByGrilles(inQuery): Promise<TarifDetail[]> {
        /*const idGrilles = inQuery.idGrilles.split('$$').filter(function (ids) {
            return ids !== ''
        });*/
        // console.log('idGrilles', idGrilles);
        let query = this.TarifDetailRepository.createQueryBuilder('tarif_detail')
            .leftJoinAndSelect('tarif_detail.produit', 'produit')
            .leftJoinAndSelect('tarif_detail.grilleTarif', 'grilleTarif')
            .leftJoin(GrilleTarif, 'grillePublique',
                'grillePublique.isGrillePublique = 1 AND grillePublique.idTypeGrille = grilleTarif.idTypeGrille')
            .leftJoinAndMapOne('tarif_detail.tarifPublique', TarifDetail, 'tarifPublique',
                'tarifPublique.idGrilleTarif = grillePublique.id AND tarifPublique.idProduit = produit.id');

        /*if (idGrilles.length > 0) {
            query.where('tarif_detail.idGrilleTarif IN :idsGrille', {idsGrille: [idGrilles]})
        }*/

        query = this.queryService.parseQuery(query, inQuery);
      return await query.getMany()
  }

    async countByGrilles(inQuery): Promise<number> {
        /*const idGrilles = inQuery.idGrilles.split('$$').filter(function (ids) {
            return ids !== ''
        });*/
        let query = this.TarifDetailRepository.createQueryBuilder('tarif_detail')
            .leftJoinAndSelect('tarif_detail.produit', 'produit')
            .leftJoinAndSelect('tarif_detail.grilleTarif', 'grilleTarif')
            .leftJoin(GrilleTarif, 'grillePublique',
                'grillePublique.isGrillePublique = 1 AND grillePublique.idTypeGrille = grilleTarif.idTypeGrille')
            .leftJoinAndMapOne('tarif_detail.tarifPublique', TarifDetail, 'tarifPublique',
                'tarifPublique.idGrilleTarif = grillePublique.id AND tarifPublique.idProduit = produit.id');

        /*if (idGrilles.length > 0) {
            query.where('tarif_detail.idGrilleTarif IN :idsGrille', {idsGrille: [idGrilles]})
        }*/

        query = this.queryService.parseQuery(query, inQuery);
        // console.log(query.getQuery());
        return await query.getCount()
    }

  // Update
  async update(id: number, partialEntry: DeepPartial<TarifDetail>): Promise<UpdateResult> {
    // this.log.debug('trying to update user...');
    return await this.TarifDetailRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<TarifDetail> {
    // this.log.debug('trying to remove user...');
    return await this.TarifDetailRepository.remove(await this.findOneById(id));
  }
}
