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
import {ICaptageAspirationSource} from '@aleaac/shared';

@Entity()
export class CaptageAspirationSource implements ICaptageAspirationSource {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;
}
