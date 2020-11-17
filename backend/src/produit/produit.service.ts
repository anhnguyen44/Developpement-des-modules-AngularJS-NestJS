import {Injectable} from '@nestjs/common';
import {Produit} from './produit.entity';
import {Log} from '../logger/logger';
import {FindManyOptions, Repository, DeepPartial, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';

@Injectable()
export class ProduitService {
    constructor(
        @InjectRepository(Produit)
        private readonly produitRepository: Repository<Produit>,
        private queryService: QueryService
        // private readonly log: Log
    ) {}

    // Create
  async create(produitDto: Produit): Promise<Produit> {
    const savedProduit = await this.produitRepository.save(produitDto);
    return savedProduit;
  }

  // Read
  async find(inQuery, idTypesProduitsAutorises = null): Promise<Produit[]> {
      let query = this.produitRepository.createQueryBuilder('produit')
          .leftJoinAndSelect('produit.type', 'type_produit');
      if (idTypesProduitsAutorises) {
          query.where('produit.idType IN :idTypesProduitsAutorises', {idTypesProduitsAutorises: [idTypesProduitsAutorises]})
      }
      query = this.queryService.parseQuery(query, inQuery);
      return await query.getMany();
  }

  async count(inQuery): Promise<number> {
      let query = this.produitRepository.createQueryBuilder('produit')
          .leftJoinAndSelect('produit.type', 'type_produit');
      query = this.queryService.parseQuery(query, inQuery);
      return await query.getCount();
  }

  async getProduitsTypeFormation(): Promise<Produit[]>{
    let query = this.produitRepository.createQueryBuilder('produit')
          .leftJoinAndSelect('produit.type', 'type_produit')
          .where('type_produit.nom =:nom',{nom:`Formation`});
      return await query.getMany();
  }

  async findOneById(id: number): Promise<Produit> {
    // this.log.debug('trying to find one user by id...');
      const result = await this.produitRepository.findOne({
        id: id
      });
      return result;
  }

  async findOneByCode(code: string): Promise<Produit> {
    // this.log.debug('trying to find one user by id...');
      const result = await this.produitRepository.findOne({
        code: code
      });
      return result;
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Produit>): Promise<UpdateResult> {
    // this.log.debug('trying to update user...');
    return await this.produitRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Produit> {
    // this.log.debug('trying to remove user...');
    return await this.produitRepository.remove(await this.findOneById(id));
  }
}
