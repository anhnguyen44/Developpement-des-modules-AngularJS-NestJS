import { Injectable, NotFoundException } from '@nestjs/common';

import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, FindOperator, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IFonctionRH } from '@aleaac/shared';
import { TFormationDCompetence } from './tFormation-dCompetence.entity';


@Injectable()
export class TFormationDCompetenceService {
  constructor(
    @InjectRepository(TFormationDCompetence)
    private readonly tFormationDCompetenceRepository: Repository<TFormationDCompetence>,
    // private readonly log: Log
  ) { }

  // Create
  async create(fonctionRHDto: TFormationDCompetence): Promise<TFormationDCompetence> {
    // this.log.debug('trying to create utilisateur-profil...');
    const rhFonction = this.tFormationDCompetenceRepository.create(fonctionRHDto);

    const savedRhFonction = await this.tFormationDCompetenceRepository.save(rhFonction);
    // this.log.debug(JSON.stringify(savedUtilisateurProfil));
    return savedRhFonction;
  }


async getAllFormateur(): Promise<TFormationDCompetence[]>{
  let query = this.tFormationDCompetenceRepository.createQueryBuilder('rh-fonction')
  .leftJoinAndSelect('rh-fonction.rh','ressource-humaine')
  .leftJoinAndSelect('ressource-humaine.utilisateur','utilisateur')
  .leftJoinAndSelect('rh-fonction.fonction','fonction')
  .where('fonction.nom = :nom',{nom:'Formateur'});

  return await query.getMany();
}

async getByIdTypeFormation(id: number): Promise<TFormationDCompetence[]>{
  let query = this.tFormationDCompetenceRepository.createQueryBuilder('tFormation-dCompetence')
  .leftJoinAndSelect('tFormation-dCompetence.typeFormation','type-formation')
  .leftJoinAndSelect('tFormation-dCompetence.dCompetence','domaine-competence')
  .where('tFormation-dCompetence.idTypeFormation = :idTF',{idTF:id});

  return await query.getMany();
}

async getByIdCompetence(id: number): Promise<TFormationDCompetence[]>{
  let query = this.tFormationDCompetenceRepository.createQueryBuilder('tFormation-dCompetence')
  .leftJoinAndSelect('tFormation-dCompetence.typeFormation','type-formation')
  .leftJoinAndSelect('tFormation-dCompetence.dCompetence','domaine-competence')
  .where('tFormation-dCompetence.idDCompetence = :idDC',{idDC:id});

  return await query.getMany();
}

async findOneById(id: number): Promise<TFormationDCompetence> {
  // this.log.debug('trying to find one menu by id...');
    const result = await this.tFormationDCompetenceRepository.findOne({
      id: id
    });
    return result;
}

async delete(id: number): Promise<TFormationDCompetence> {
  // this.log.debug('trying to remove menu...');
  return await this.tFormationDCompetenceRepository.remove(await this.findOneById(id));
}

async deleteByIdFormation(id: number){
  // return await this.formationRhRepository.delete(RhFormationValide,{RhFormationValide.idRh:id});
  // return await this.formationRhRepository.delete(RhFormationValide, { idRh : id } );

  return await this.tFormationDCompetenceRepository.createQueryBuilder()
  .delete()
  .from(TFormationDCompetence)
  .where("idTypeFormation = :idTF", { idTF: id })
  .execute();

}

async deleteByIdCompetence(id: number){
  // return await this.formationRhRepository.delete(RhFormationValide,{RhFormationValide.idRh:id});
  // return await this.formationRhRepository.delete(RhFormationValide, { idRh : id } );

  return await this.tFormationDCompetenceRepository.createQueryBuilder()
  .delete()
  .from(TFormationDCompetence)
  .where("idDCompetence = :idDC", { idDC: id })
  .execute();

}



}
