import {Injectable} from '@nestjs/common';
import {Profil} from './profil.entity';
import {Log} from '../logger/logger';
import {FindManyOptions, Repository, DeepPartial, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QueryService} from '../query/query.service';

@Injectable()
export class ProfilService {
    constructor(
        @InjectRepository(Profil)
        private readonly profilRepository: Repository<Profil>,
        private queryService: QueryService
        // private readonly log: Log
    ) {}

    // Create
  async create(profilDto: Profil): Promise<Profil> {
    const savedProfil = await this.profilRepository.save(profilDto);
    return savedProfil;
  }

  // Read
  async find(inQuery?: string): Promise<Profil[]> {
        let query = this.profilRepository.createQueryBuilder('profil')
            .leftJoinAndSelect('profil.droits', 'droit');

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        const result = await query.getMany();

        result.forEach(profil => {
            profil.droits.sort((a, b) => a.nom > b.nom ? 1 : -1)
        });
        return result;
  }

  async getAllProfilInterne(): Promise<Profil[]>{
    return await this.profilRepository.createQueryBuilder('profil').where('profil.isInterne =:boolean', {boolean: 1}).getMany();
  }
  
  async getAllProfilExterne(): Promise<Profil[]>{
    return await this.profilRepository.createQueryBuilder('profil').where('profil.isInterne =:boolean', {boolean: 0}).getMany();
  }

  async count(inQuery?: string): Promise<number> {
      let query = this.profilRepository.createQueryBuilder('profil').leftJoinAndSelect('profil.droits', 'droit');

      if (inQuery) {
          query = this.queryService.parseQuery(query, inQuery);
      }

      return await query.getCount();
  }

  async findOneById(id: number): Promise<Profil> {
    // this.log.debug('trying to find one user by id...');
      const result = await this.profilRepository.findOne({
        id: id
      });
      result.droits.sort((a, b) => a.nom > b.nom ? 1 : -1);
      return result;
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<Profil>): Promise<UpdateResult> {
    // this.log.debug('trying to update user...');
    return await this.profilRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<Profil> {
    // this.log.debug('trying to remove user...');
    return await this.profilRepository.remove(await this.findOneById(id));
  }
}
