import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { ICivilite } from '@aleaac/shared';

@Entity()
export class Civilite implements ICivilite {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    nom: string;

    @Column({ nullable: true })
    @ApiModelProperty()
    abbrev: string;
}
