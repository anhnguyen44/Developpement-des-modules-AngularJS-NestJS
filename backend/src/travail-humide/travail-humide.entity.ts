import {
    Entity,
    ManyToOne,
    Column,
    JoinColumn,
    PrimaryColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { ITravailHumide } from '@aleaac/shared';

@Entity()
export class TravailHumide implements ITravailHumide {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;
}
