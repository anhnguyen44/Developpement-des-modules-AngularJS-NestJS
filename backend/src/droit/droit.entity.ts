import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { IDroit } from '@aleaac/shared';

@Entity()
export class Droit implements IDroit{
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    code: string;

    @Column()
    @ApiModelProperty()
    niveau: number;
}
