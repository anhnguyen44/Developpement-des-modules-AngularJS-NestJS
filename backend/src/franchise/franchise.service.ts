import { Injectable } from '@nestjs/common';
import { Franchise } from './franchise.entity';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, In, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IFranchise } from '@aleaac/shared';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { QueryService } from '../query/query.service';

@Injectable()
export class FranchiseService {
  constructor(
    @InjectRepository(Franchise)
    private readonly franchiseRepository: Repository<Franchise>,
    @InjectRepository(UtilisateurProfil)
    private readonly utilisateurProfilRepository: Repository<UtilisateurProfil>,
    private queryService: QueryService
    // private readonly log: Log
  ) { }

  // Create
  async create(franchiseDto: IFranchise): Promise<Franchise> {
    // console.log('create franchise');
    const franchise = this.franchiseRepository.create(franchiseDto);
    const savedFranchise = await this.franchiseRepository.save(franchise);

    return savedFranchise;
  }

  // Read
  async find(inQuery?: any): Promise<Franchise[]> {

    let query = this.franchiseRepository.createQueryBuilder('franchise');
    // console.log('inQuery : ' + JSON.stringify(inQuery));

    // Check si objet pas vide
    if (JSON.stringify(inQuery) !== '{}') {
      query = this.queryService.parseQuery(query, inQuery);
    } else {
      query.where('isSortieReseau = false');
    }

    return await query.getMany();
  }

  async count(inQuery): Promise<number> {
    let query = this.franchiseRepository.createQueryBuilder('franchise');

    if (JSON.stringify(inQuery) !== '{}') {
      query = this.queryService.parseQuery(query, inQuery);
    } else {
      query.where('isSortieReseau = false');
    }

    return await query.getCount();
  }

  async findOneById(id: number, findOptions?: FindOneOptions<Franchise>): Promise<Franchise> {
    // console.log('find franchise by id');
    const options: FindOneOptions<Franchise> = {
      where: {
        isSortieReseau: false
      },
      ...findOptions
    }
    const result = await this.franchiseRepository.findOneOrFail(id, options);
    return result;
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Franchise>): Promise<UpdateResult> {
    return await this.franchiseRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Franchise> {
    return await this.franchiseRepository.remove(await this.findOneById(id));
  }

  // FranchisesParUtilisateur
  async getByUtilisateur(idUtilisateur): Promise<Franchise[]> {
    // console.log('ok1');
    const optionsUtilisateurProfil = {
      where: {
        select: ['idFranchise'],
        idUtilisateur: idUtilisateur,
        isSortieReseau: false
      }
    };
    // console.log(optionsUtilisateurProfil);
    const utilisateurProfil = await this.utilisateurProfilRepository.find(optionsUtilisateurProfil);
    // console.log(utilisateurProfil);
    const idsFranchise = [...new Set(utilisateurProfil.map(x => x.idFranchise))];
    // console.log(idsFranchise);
    const optionsFranchise: FindManyOptions<Franchise> = { where: { isSortieReseau: false }, order: { raisonSociale: 'ASC' } };
    // console.log(optionsFranchise);
    return await this.franchiseRepository.findByIds(idsFranchise, optionsFranchise)
  }
}
