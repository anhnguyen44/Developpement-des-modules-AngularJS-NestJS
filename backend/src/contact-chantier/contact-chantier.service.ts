import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {Log} from '../logger/logger';
import { ContactChantier } from './contact-chantier.entity';
import { IContactChantier } from '@aleaac/shared';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Injectable()
export class ContactChantierService {
  constructor(
    @InjectRepository(ContactChantier) private readonly contactChantierRepository: Repository<ContactChantier>,
    // private readonly log: Log,
  ) {}

  // Create
  // Precondition: the contactChantier needs to have a unique nom
  async create(contactChantierDto: IContactChantier): Promise<ContactChantier> {
    // this.log.debug('trying to create user...');

    // const existingContactChantier = await this.contactChantierExists(contactChantierDto.nom);
    // if (existingContactChantier) {
    //   throw new Error('ContactChantier already exists');
    // }

    const contactChantier = this.contactChantierRepository.create(contactChantierDto);

    const savedContactChantier = await this.contactChantierRepository.save(contactChantier);
    // this.log.debug(JSON.stringify(savedContactChantier));
    return savedContactChantier;
  }

  // contactChantierExists(nom: string): Promise<boolean> {
  //   // this.log.debug('checking if contactChantier exists...');
  //   return this.findOneByName(nom).then(user => {
  //     return !!user;
  //   });
  // }

  // Read
  async find(findOptions?: FindManyOptions<ContactChantier>): Promise<ContactChantier[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} contactChantiers with an offset of ${options.skip} ...`);
    return await this.contactChantierRepository.find(options);
  }

  async findOneById(id: number): Promise<ContactChantier> {
    // this.log.debug('trying to find one contactChantier by id...');
    return await this.contactChantierRepository.findOne({
        id: id
    });
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<ContactChantier>): Promise<UpdateResult> {
    // this.log.debug('trying to update contactChantier...');
    return await this.contactChantierRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<ContactChantier> {
    // this.log.debug('trying to remove contactChantier...');
    return await this.contactChantierRepository.remove(await this.findOneById(id));
  }
}
