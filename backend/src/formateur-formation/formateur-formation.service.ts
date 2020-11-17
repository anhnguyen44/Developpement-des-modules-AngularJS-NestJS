import { Injectable, NotFoundException } from '@nestjs/common';

import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, FindOperator, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FormateurFormation } from './formateur-formation.entity';
import { IFormateurFormation } from '@aleaac/shared';


@Injectable()
export class FormateurFormationService {
  constructor(
    @InjectRepository(FormateurFormation)
    private readonly formateurFormationRepository: Repository<FormateurFormation>,
    // private readonly log: Log
  ) { }


  async create(formateurRHDto: IFormateurFormation): Promise<FormateurFormation> {
    // this.log.debug('trying to create utilisateur-profil...');
    const rhFormateur = this.formateurFormationRepository.create(formateurRHDto);

    const saved = await this.formateurFormationRepository.save(rhFormateur);
    // this.log.debug(JSON.stringify(savedUtilisateurProfil));
    return saved;
  }

  // async getAllFormateur(): Promise<RhFonction[]>{
  //   let query = this.rhFonctionRepository.createQueryBuilder('rh-fonction')
  //   .leftJoinAndSelect('rh-fonction.rh','ressource-humaine')
  //   .leftJoinAndSelect('ressource-humaine.utilisateur','utilisateur')
  //   .leftJoinAndSelect('rh-fonction.fonction','fonction')
  //   .where('fonction.nom = :nom',{nom:'Formateur'});

  //   return await query.getMany();
  // }

  // async getFormateurByIdTypeFormation(id:number): Promise<RhFonction[]>{
  //   let query = this.rhFonctionRepository.createQueryBuilder('rh-fonction')
  //   .leftJoinAndSelect('rh-fonction.rh','ressource-humaine')
  //   .leftJoinAndSelect('ressource-humaine.formationValide','RhFormationValide')
  //   .leftJoinAndSelect('ressource-humaine.utilisateur','utilisateur')
  //   .leftJoinAndSelect('rh-fonction.fonction','fonction')
  //   .where('fonction.nom = :nom',{nom:'Formateur'})
  //   .andWhere('RhFormationValide.idTypeFormation=:id',{id:id})
  //   .andWhere('RhFormationValide.habilite=:boo',{boo:1});

  //   return await query.getMany();
  // }

  // async getFormateurByIdTypeFormationParFranchise(id:number,idFranchise:number): Promise<RhFonction[]>{
  //   console.log(idFranchise);
  //   let query = this.rhFonctionRepository.createQueryBuilder('rh-fonction')
  //   .leftJoinAndSelect('rh-fonction.rh','ressource-humaine')
  //   .leftJoinAndSelect('ressource-humaine.formationValide','RhFormationValide')
  //   .leftJoinAndSelect('ressource-humaine.utilisateur','utilisateur')
  //   .leftJoinAndSelect('rh-fonction.fonction','fonction')
  //   .where('fonction.nom = :nom',{nom:'Formateur'})
  //   .andWhere('RhFormationValide.idTypeFormation=:id',{id:id})
  //   .andWhere('RhFormationValide.habilite=:boo',{boo:1})
  //   .andWhere('ressource-humaine.idFranchise=:idFranchise',{idFranchise:idFranchise});

  //   return await query.getMany();
  // }

  async deleteByIdformateur(id: number) {

    return await this.formateurFormationRepository.createQueryBuilder()
      .delete()
      .from(FormateurFormation)
      .where("idFormateur = :id", { id: id })
      .execute();
  }


  async delete(id: number) {
    const fo = await this.formateurFormationRepository.createQueryBuilder('formateur-formation')
        .where('id = :id', { id: id }).getOne();
    return await this.formateurFormationRepository.remove(fo)
}
}
