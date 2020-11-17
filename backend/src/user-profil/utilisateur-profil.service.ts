import { Injectable, NotFoundException } from '@nestjs/common';
import { UtilisateurProfil } from './utilisateur-profil.entity';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult, FindOperator, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CUtilisateurProfil, Utilisateur, Profil } from '@aleaac/shared';

@Injectable()
export class UtilisateurProfilService {
  constructor(
    @InjectRepository(UtilisateurProfil)
    private readonly profilUtilisateurRepository: Repository<UtilisateurProfil>,
    // private readonly log: Log
  ) { }

  // Create
  async create(utilisateurProfilDto: CUtilisateurProfil): Promise<UtilisateurProfil> {
    // this.log.debug('trying to create utilisateur-profil...');
    const profil = this.profilUtilisateurRepository.create(utilisateurProfilDto);

    const savedUtilisateurProfil = await this.profilUtilisateurRepository.save(profil);
    // this.log.debug(JSON.stringify(savedUtilisateurProfil));
    return savedUtilisateurProfil;
  }

  // Read
  async find(findOptions?: FindManyOptions<UtilisateurProfil>): Promise<UtilisateurProfil[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} users with an offset of ${options.skip} ...`);
    let result = await this.profilUtilisateurRepository.find(options);
    result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);
    return result;
  }

  async exists(idUtilisateur: number, idFranchise: number, idProfil: number): Promise<boolean> {
    // this.log.debug('trying to find one user by id...');
    const profilUtilisateur = await this.profilUtilisateurRepository
      .createQueryBuilder('p')
      .select(['p.idUtilisateur', 'p.idProfil', 'p.idFranchise'])
      .where('p.idUtilisateur = :userId AND p.idProfil = :idProfil AND p.idFranchise = :idFranchise',
        { userId: idUtilisateur, idProfil: idProfil, idFranchise: idFranchise })
      .getOne();

    if (!profilUtilisateur || profilUtilisateur === undefined || profilUtilisateur === null) {
      return false;
    }

    return true;
  }

  async findByUtilisateur(idUtilisateur: number): Promise<UtilisateurProfil[]> {
    const options = {
      where: {
        idUtilisateur: idUtilisateur
      },
      relations: ['franchise']
    };
    let result = await this.profilUtilisateurRepository.find(options);
    result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);
    return result;
  }

  async findByProfil(idProfil: number): Promise<UtilisateurProfil[]> {
    let result = await this.profilUtilisateurRepository
      .createQueryBuilder('p')
      .select(['p.idUtilisateur', 'p.idProfil', 'p.idFranchise'])
      .where('p.idProfil = :profilId', { profilId: idProfil })
      .getMany();

      result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);

      return result;
  }

  async findByFranchise(idFranchise: number): Promise<UtilisateurProfil[]> {

    const options: FindManyOptions<UtilisateurProfil> = {
      where: {
        idFranchise: idFranchise
      }
    }
    let result = await this.find(options);
    result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);

    return result;
  }

  async findByFranchises(idFranchises: number[]): Promise<UtilisateurProfil[]> {
    const options: FindManyOptions<UtilisateurProfil> = {
      where: {
        idFranchise: In(idFranchises)
      }
    }

    let result = await this.find(options);
    result = result.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);

    return result;
  }

  // Delete
  async remove(utilisateurProfilDto: UtilisateurProfil): Promise<UtilisateurProfil> {
    if (this.exists(utilisateurProfilDto.utilisateur.id, utilisateurProfilDto.franchise.id, utilisateurProfilDto.profil.id)) {
      return await this.profilUtilisateurRepository.remove(utilisateurProfilDto);
    } else {
      throw new NotFoundException('Impossible de supprimer car introuvable');
    }
  }
}
