import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IMomentObjectif, EnumTypeStrategie } from '@aleaac/shared';

@Entity()
export class MomentObjectif implements IMomentObjectif {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    code: string;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    typeStrategie: number | null;
}
