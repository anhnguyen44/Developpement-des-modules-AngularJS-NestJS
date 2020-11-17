import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { IMotifAbandonCommande } from '@aleaac/shared';

@Entity()
export class MotifAbandonCommande implements IMotifAbandonCommande {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    isSuppression: boolean;
}
