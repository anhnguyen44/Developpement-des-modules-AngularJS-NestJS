import { Injectable, NotFoundException } from '@nestjs/common';
import { RhFonction } from './rh-fonction.entity';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, FindOperator, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IFonctionRH } from '@aleaac/shared';


@Injectable()
export class RhFonctionService {
  constructor(
    @InjectRepository(RhFonction)
    private readonly rhFonctionRepository: Repository<RhFonction>,
    // private readonly log: Log
  ) { }

  // Create
  async create(fonctionRHDto: IFonctionRH): Promise<RhFonction> {
    // this.log.debug('trying to create utilisateur-profil...');
    const rhFonction = this.rhFonctionRepository.create(fonctionRHDto);

    const savedRhFonction = await this.rhFonctionRepository.save(rhFonction);
    // this.log.debug(JSON.stringify(savedUtilisateurProfil));
    return savedRhFonction;
  }

//   // Read
//   async find(findOptions?: FindManyOptions<UtilisateurProfil>): Promise<UtilisateurProfil[]> {
//     const options = {
//       take: 100,
//       skip: 0,
//       ...findOptions // overwrite default ones
//     };
//     // this.log.debug(`searching for max ${options.take} users with an offset of ${options.skip} ...`);
//     let result = await this.profilUtilisateurRepository.find(options);
//     result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);
//     return result;
//   }

//   async exists(idUtilisateur: number, idFranchise: number, idProfil: number): Promise<boolean> {
//     // this.log.debug('trying to find one user by id...');
//     const profilUtilisateur = await this.profilUtilisateurRepository
//       .createQueryBuilder('p')
//       .select(['p.idUtilisateur', 'p.idProfil', 'p.idFranchise'])
//       .where('p.idUtilisateur = :userId AND p.idProfil = :idProfil AND p.idFranchise = :idFranchise',
//         { userId: idUtilisateur, idProfil: idProfil, idFranchise: idFranchise })
//       .getOne();

//     if (!profilUtilisateur || profilUtilisateur === undefined || profilUtilisateur === null) {
//       return false;
//     }

//     return true;
//   }

//   async findByUtilisateur(idUtilisateur: number): Promise<UtilisateurProfil[]> {
//     const options = {
//       where: {
//         idUtilisateur: idUtilisateur
//       },
//       relations: ['franchise']
//     };
//     let result = await this.profilUtilisateurRepository.find(options);
//     result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);
//     return result;
//   }

//   async findByProfil(idProfil: number): Promise<UtilisateurProfil[]> {
//     let result = await this.profilUtilisateurRepository
//       .createQueryBuilder('p')
//       .select(['p.idUtilisateur', 'p.idProfil', 'p.idFranchise'])
//       .where('p.idProfil = :profilId', { profilId: idProfil })
//       .getMany();

//       result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);

//       return result;
//   }

//   async findByFranchise(idFranchise: number): Promise<UtilisateurProfil[]> {

//     const options: FindManyOptions<UtilisateurProfil> = {
//       where: {
//         idFranchise: idFranchise
//       }
//     }
//     let result = await this.find(options);
//     result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);

//     return result;
//   }

//   async findByFranchises(idFranchises: number[]): Promise<UtilisateurProfil[]> {
//     const options: FindManyOptions<UtilisateurProfil> = {
//       where: {
//         idFranchise: In(idFranchises)
//       }
//     }

//     let result = await this.find(options);
//     result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);

//     return result;
//   }

//   // Delete
//   async remove(utilisateurProfilDto: UtilisateurProfil): Promise<UtilisateurProfil> {
//     if (this.exists(utilisateurProfilDto.utilisateur.id, utilisateurProfilDto.franchise.id, utilisateurProfilDto.profil.id)) {
//       return await this.profilUtilisateurRepository.remove(utilisateurProfilDto);
//     } else {
//       throw new NotFoundException('Impossible de supprimer car introuvable');
//     }
//   }

async getAllFormateur(): Promise<RhFonction[]>{
  let query = this.rhFonctionRepository.createQueryBuilder('rh-fonction')
  .leftJoinAndSelect('rh-fonction.rh','ressource-humaine')
  .leftJoinAndSelect('ressource-humaine.utilisateur','utilisateur')
  .leftJoinAndSelect('rh-fonction.fonction','fonction')
  .where('fonction.nom = :nom',{nom:'Formateur'});

  return await query.getMany();
}

async getFormateurByIdTypeFormation(id:number): Promise<RhFonction[]>{
  let query = this.rhFonctionRepository.createQueryBuilder('rh-fonction')
  .leftJoinAndSelect('rh-fonction.rh','ressource-humaine')
  .leftJoinAndSelect('ressource-humaine.formationValide','RhFormationValide')
  .leftJoinAndSelect('ressource-humaine.utilisateur','utilisateur')
  .leftJoinAndSelect('rh-fonction.fonction','fonction')
  .where('fonction.nom = :nom',{nom:'Formateur'})
  .andWhere('RhFormationValide.idTypeFormation=:id',{id:id})
  .andWhere('RhFormationValide.habilite=:boo',{boo:1});

  return await query.getMany();
}

async getFormateurByIdTypeFormationParFranchise(id:number,idFranchise:number): Promise<RhFonction[]>{
  console.log(idFranchise);
  let query = this.rhFonctionRepository.createQueryBuilder('rh-fonction')
  .leftJoinAndSelect('rh-fonction.rh','ressource-humaine')
  .leftJoinAndSelect('ressource-humaine.formationValide','RhFormationValide')
  .leftJoinAndSelect('ressource-humaine.utilisateur','utilisateur')
  .leftJoinAndSelect('rh-fonction.fonction','fonction')
  .where('fonction.nom = :nom',{nom:'Formateur'})
  .andWhere('RhFormationValide.idTypeFormation=:id',{id:id})
  .andWhere('RhFormationValide.habilite=:boo',{boo:1})
  .andWhere('ressource-humaine.idFranchise=:idFranchise',{idFranchise:idFranchise});

  return await query.getMany();
}

async deleteByIdRh(id: number){
  console.log('coucoucoucoucouc');
  console.log(id);
  console.log(id);
  console.log(id);
  
  // return await this.formationRhRepository.delete(RhFormationValide,{RhFormationValide.idRh:id});
  // return await this.formationRhRepository.delete(RhFormationValide, { idRh : id } );

  return await this.rhFonctionRepository.createQueryBuilder()
  .delete()
  .from(RhFonction)
  .where("idRh = :idRh", { idRh: id })
  .execute();

}
}
