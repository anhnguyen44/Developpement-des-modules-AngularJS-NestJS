import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { IListe, EnumTypePartageListe } from '@aleaac/shared';
import { Franchise } from '../franchise/franchise.entity';

@Entity()
export class Liste implements IListe {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ type: 'int' })
    @ApiModelProperty()
    typePartage: number;

    @Column()
    @ApiModelProperty()
    nomListe: string;

    @Column()
    @ApiModelProperty()
    resume: string;

    @Column({ type: 'text' })
    @ApiModelProperty()
    valeur: string;

    @Column()
    @ApiModelProperty()
    ordre: number;

    @Column()
    @ApiModelProperty()
    isLivreParDefaut: boolean;

    @Column({ nullable: true })
    @ApiModelProperty()
    sousListe: string | null;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: 'idFranchise' })
    franchise: Franchise | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    idFranchise: number | null;
}
