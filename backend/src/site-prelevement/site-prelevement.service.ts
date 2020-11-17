import { Injectable, Inject } from '@nestjs/common';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Log } from '../logger/logger';
import { SitePrelevement } from './site-prelevement.entity';
import { ISitePrelevement } from '@aleaac/shared';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { LatLng } from '../geocoding/LatLng';
import { GeocodingService } from '../geocoding/geocoding';
import { Adresse } from '../adresse/adresse.entity';
import { QueryService } from '../query/query.service';

@Injectable()
export class SitePrelevementService {
  constructor(
    @InjectRepository(SitePrelevement) private readonly sitePrelevementRepository: Repository<SitePrelevement>,
    @InjectRepository(Adresse) private readonly adresseRepository: Repository<Adresse>,
    private readonly geocodingService: GeocodingService,
    private readonly queryService: QueryService,
  ) { }

  // Create
  // Precondition: the sitePrelevement needs to have a unique nom
  async create(sitePrelevementDto: ISitePrelevement): Promise<SitePrelevement> {
    // this.log.debug('trying to create user...');
    if (!sitePrelevementDto.latitude || sitePrelevementDto.latitude === 0.00000000
      || !sitePrelevementDto.longitude || sitePrelevementDto.longitude === 0.00000000) {
      sitePrelevementDto.latitude = null;
      sitePrelevementDto.longitude = null;
    }
    const latLng: LatLng = await this.geocodingService.getLatLng(sitePrelevementDto.adresse.adresse, sitePrelevementDto.adresse.cp)
    sitePrelevementDto.adresse.latitude = latLng.latitude;
    sitePrelevementDto.adresse.longitude = latLng.longitude;
    const adresse = await this.adresseRepository.save(sitePrelevementDto.adresse);

    delete sitePrelevementDto.adresse;
    // console.log(adresse);
    sitePrelevementDto.idAdresse = adresse.id;

    const sitePrelevement = this.sitePrelevementRepository.create(sitePrelevementDto);

    const savedSitePrelevement = await this.sitePrelevementRepository.save(sitePrelevement);
    // this.log.debug(JSON.stringify(savedSitePrelevement));
    return savedSitePrelevement;
  }

  // Read
  async find(findOptions?: FindManyOptions<SitePrelevement>): Promise<SitePrelevement[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} sitePrelevements with an offset of ${options.skip} ...`);
    return await this.sitePrelevementRepository.find(options);
  }

  async findByChantier(idChantier: number, inQuery: string): Promise<SitePrelevement[]> {
    let query = this.sitePrelevementRepository.createQueryBuilder('sitePrelevement')
            .leftJoinAndSelect('sitePrelevement.adresse', 'adresse')
            .leftJoinAndSelect('sitePrelevement.batiments', 'batiments')
            .where('sitePrelevement.idChantier = :idChantier', {idChantier: idChantier});
        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
  }

  async findOneById(id: number): Promise<SitePrelevement> {
    // this.log.debug('trying to find one sitePrelevement by id...');
    return await this.sitePrelevementRepository.findOne({
      id: id
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<SitePrelevement>): Promise<SitePrelevement> {
    // this.log.debug('trying to update sitePrelevement...');
    if (!partialEntry.latitude || partialEntry.latitude === 0.00000000
      || !partialEntry.longitude || partialEntry.longitude === 0.00000000) {
      partialEntry.latitude = null;
      partialEntry.longitude = null;
    }
    if (partialEntry.adresse) {
      const latLng: LatLng = await this.geocodingService.getLatLng(partialEntry.adresse.adresse, partialEntry.adresse.cp)
      partialEntry.adresse.latitude = latLng.latitude;
      partialEntry.adresse.longitude = latLng.longitude;
      await this.adresseRepository.save(partialEntry.adresse);
    }

    return await this.sitePrelevementRepository.save(partialEntry);
  }

  // Delete
  async remove(id: number): Promise<SitePrelevement> {
    // this.log.debug('trying to remove sitePrelevement...');
    return await this.sitePrelevementRepository.remove(await this.findOneById(id));
  }
}
