import { Injectable, NotFoundException } from '@nestjs/common';
import { GrilleTarif } from './grille-tarif.entity';
import { Log } from '../logger/logger';
import { FindManyOptions, Repository, DeepPartial, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeGrille, TarifDetail } from '@aleaac/shared';
import { Product } from 'aws-sdk/clients/ssm';
import { Produit } from '../produit/produit.entity';
import { QueryService } from '../query/query.service';

@Injectable()
export class GrilleTarifService {
  constructor(
    @InjectRepository(GrilleTarif)
    private readonly grilleTarifRepository: Repository<GrilleTarif>,
    @InjectRepository(Produit)
    private readonly produitRepository: Repository<Produit>,
    @InjectRepository(TarifDetail)
    private readonly tarifDetailRepository: Repository<TarifDetail>,
    @InjectRepository(TypeGrille)
    private readonly typeGrilleRepository: Repository<TypeGrille>,
    private queryService: QueryService
    // private readonly log: Log
  ) { }

  // Create
  async create(GrilleTarifDto: GrilleTarif): Promise<GrilleTarif> {
    const savedGrilleTarif = await this.grilleTarifRepository.save(GrilleTarifDto);
    this.createLignes(savedGrilleTarif.id);
    return savedGrilleTarif;
  }

  // Read
  async find(findOptions?: FindManyOptions<GrilleTarif>): Promise<GrilleTarif[]> {
    const options: FindManyOptions<GrilleTarif> = {
      take: 100,
      skip: 0,
      order: {
        reference: 'ASC'
      },
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} users with an offset of ${options.skip} ...`);
    const result = await this.grilleTarifRepository.find(options);
    return result;
  }

  async findOneById(id: number): Promise<GrilleTarif> {
    // this.log.debug('trying to find one user by id...');
    const result = await this.grilleTarifRepository.findOne({
      id: id
    });

    result.details.sort((a, b) => {
      if (a.produit.rang < b.produit.rang) {
        return -1
      }
      if (a.produit.rang > b.produit.rang) {
        return 1
      }
      return 0
    });

    result.typeGrille.categories.sort((a, b) => {
      if (a.rang < b.rang) {
        return -1
      }
      if (a.rang > b.rang) {
        return 1
      }
      return 0
    });

    return result;
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<GrilleTarif>): Promise<UpdateResult> {
    // this.log.debug('trying to update user...');
    return await this.grilleTarifRepository.update(id, partialEntry);
  }

  async exists(idFranchise: number, reference: string): Promise<boolean> {
    const grille = await this.find({
      where: {
        reference: reference,
        idFranchise: idFranchise
      }
    });
    return grille.length > 0;
  }

  async createLignes(idGrille: number, idFrom?: number) {
    const currentGrille = await this.findOneById(idGrille);
    if (!currentGrille) {
      throw new NotFoundException();
    }

    // Cas général
    if (idFrom === undefined) {
      const listeCategoriesProduits = currentGrille.typeGrille.categories;
      const listeProduits = new Array<Produit>();

      // On liste tous les produits nécessaires, catégorie par catégorie
      for (const categ of listeCategoriesProduits) {
        listeProduits.push(...await this.produitRepository.find({ where: { idType: categ.id } }));
      }

      for (const prd of listeProduits) {
        const detail = await this.tarifDetailRepository.find({
          where: {
            idGrilleTarif: idGrille,
            idProduit: prd.id
          }
        });

        if (!detail || detail.length === 0) {
          const nouveauDetail = new TarifDetail();
          nouveauDetail.idGrilleTarif = idGrille;
          nouveauDetail.idProduit = prd.id;
          nouveauDetail.prixUnitaire = prd.prixUnitaire;
          nouveauDetail.tempsUnitaire = prd.tempsUnitaire;
          nouveauDetail.uniteTemps = prd.uniteTemps;

          this.tarifDetailRepository.save(nouveauDetail);
        }
      }
    } else {
      // Cas de la duplication
      const detailsExistants = await this.tarifDetailRepository.find({
        where: {
          idGrilleTarif: idFrom
        }
      });
      for (const det of detailsExistants) {
        const nouveauDetail = new TarifDetail();
        nouveauDetail.idGrilleTarif = idGrille;
        nouveauDetail.idProduit = det.id;
        nouveauDetail.prixUnitaire = det.prixUnitaire;
        nouveauDetail.tempsUnitaire = det.tempsUnitaire;
        nouveauDetail.uniteTemps = det.uniteTemps;

        this.tarifDetailRepository.save(nouveauDetail);
      }
    }
  }

  async initGrille(typeGrille: TypeGrille, idFranchise: number, reference?: string, isGrillePublique: boolean = false) {
    if (reference !== undefined) {
      const grille = await this.find({
        where: {
          reference: reference,
          idFranchise: idFranchise
        }
      });
      if (grille.length === 0) {
        // On crée la grille puis les lignes
        let nouvelleGrille = new GrilleTarif();
        nouvelleGrille.idTypeGrille = typeGrille.id;
        nouvelleGrille.idFranchise = idFranchise;
        nouvelleGrille.reference = reference;
        nouvelleGrille.isGrillePublique = isGrillePublique;

        nouvelleGrille = await this.create(nouvelleGrille);

        this.createLignes(nouvelleGrille.id);
      } else {
        // On crée ou update les lignes
        this.createLignes(grille[0].id);
      }
    } else {
      // On crée le grille par défaut et/ou crée ou update les lignes
      this.initGrille(typeGrille, idFranchise, typeGrille.refDefaut, true);
    }
  }

  async initGrillesFranchise(idFranchise: number) {
    const typesGrilles = await this.typeGrilleRepository.find();
    // On passe sur tous les TPUB ou on les crée
    for (const typeGrille of typesGrilles) {
      this.initGrille(typeGrille, idFranchise, typeGrille.refDefaut, true);
    }

    // Si d'autres existent, on le MàJ aussi
    const autresGrilles = await this.find({
      where: {
        idFranchise: idFranchise,
        isGrillePublique: false
      }
    });

    for (const grille of autresGrilles) {
      this.initGrille(grille.typeGrille, idFranchise, grille.reference, false);
    }
  }

  async duplicate(from: GrilleTarif, newReference: string): Promise<GrilleTarif> {
    const grilleFrom = from;
    let nouvelleGrille = new GrilleTarif();
    nouvelleGrille.idTypeGrille = grilleFrom.typeGrille.id;
    nouvelleGrille.idFranchise = grilleFrom.idFranchise;
    nouvelleGrille.reference = newReference && newReference !== '' ? newReference : grilleFrom.reference + ' - Copie';
    nouvelleGrille.isGrillePublique = false;
    nouvelleGrille.commentaire = grilleFrom.commentaire;
    nouvelleGrille.conditions = grilleFrom.conditions;

    nouvelleGrille = await this.create(nouvelleGrille);

    this.createLignes(nouvelleGrille.id, from.id);

    return nouvelleGrille;
  }

  async getAll(idFranchise: number, inQuery: string): Promise<GrilleTarif[]> {
    let query = this.grilleTarifRepository.createQueryBuilder('grilleTarif')
      .where('idFranchise = :idFranchise', { idFranchise: idFranchise });

    query = this.queryService.parseQuery(query, inQuery);

    return await query.getMany();
  }

  async getPublic(idFranchise: number): Promise<GrilleTarif[]> {
    return await this.grilleTarifRepository.createQueryBuilder('grilleTarif')
      .where('grilleTarif.idFranchise = :idFranchise && grilleTarif.isGrillePublique = 1', { idFranchise: idFranchise })
      .getMany();
  }

  async getPublicWithDetail(idFranchise: number): Promise<GrilleTarif[]> {
    return await this.grilleTarifRepository.createQueryBuilder('grilleTarif')
      .leftJoinAndSelect('grilleTarif.details', 'details')
      .where('grilleTarif.idFranchise = :idFranchise && grilleTarif.isGrillePublique = 1', { idFranchise: idFranchise })
      .getMany();
  }

  async countAll(idFranchise: number, inQuery: string): Promise<number> {
    let query = this.grilleTarifRepository.createQueryBuilder('grilleTarif')
      .where('idFranchise = :idFranchise', { idFranchise: idFranchise });

    query = this.queryService.parseQuery(query, inQuery);

    return await query.getCount();
  }

  // Delete
  async remove(id: number): Promise<GrilleTarif> {
    // this.log.debug('trying to remove user...');
    return await this.grilleTarifRepository.remove(await this.findOneById(id));
  }
}
