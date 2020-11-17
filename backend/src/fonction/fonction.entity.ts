import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { IFonction } from '@aleaac/shared';

@Entity()
export class Fonction implements IFonction {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;
}
