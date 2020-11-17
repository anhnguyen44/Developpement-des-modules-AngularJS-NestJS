import {Injectable, Inject} from '@nestjs/common';
import {FindManyOptions, Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {Fonction} from './fonction.entity';
import {Bureau} from '../bureau/bureau.entity';

@Injectable()
export class FonctionService {
  constructor(
    @InjectRepository(Fonction)
    private readonly fonctionRepository: Repository<Fonction>,
  ) {}

  async getAll(): Promise<Fonction[]> {
      return await this.fonctionRepository.find();
  }
}
