import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { TypeFacturation } from './type-facturation.entity';

@Injectable()
export class TypeFacturationService {
  constructor(
    @InjectRepository(TypeFacturation)
    private readonly TypeFacturationRepository: Repository<TypeFacturation>,
    // private readonly log: Log
  ) { }

  // Create
  async create(TypeFacturationDto: TypeFacturation): Promise<TypeFacturation> {
    const savedTypeFacturation = await this.TypeFacturationRepository.save(TypeFacturationDto);
    return savedTypeFacturation;
  }

  // Read
  async find(findOptions?: FindManyOptions<TypeFacturation>): Promise<TypeFacturation[]> {
    const options: FindManyOptions<TypeFacturation> = {
      take: 100,
      skip: 0,
      order: {
        nom: 'ASC'
      },
      ...findOptions // overwrite default ones
    };
    // this.log.debug(`searching for max ${options.take} users with an offset of ${options.skip} ...`);
    const result = await this.TypeFacturationRepository.find(options);

    return result;
  }

  async findOneById(id: number): Promise<TypeFacturation> {
    // this.log.debug('trying to find one user by id...');
    const result = await this.TypeFacturationRepository.findOne({
      id: id
    });
    return result;
  }

  // Update
  async update(id: number, partialEntry: DeepPartial<TypeFacturation>): Promise<UpdateResult> {
    // this.log.debug('trying to update user...');
    return await this.TypeFacturationRepository.update(id, partialEntry);
  }

  // Delete
  async remove(id: number): Promise<TypeFacturation> {
    // this.log.debug('trying to remove user...');
    return await this.TypeFacturationRepository.remove(await this.findOneById(id));
  }
}
