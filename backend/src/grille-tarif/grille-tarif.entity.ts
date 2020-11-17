import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IGrilleTarif } from '@aleaac/shared';
import { Franchise } from '../franchise/franchise.entity';
import { TypeGrille } from '../type-grille/type-grille.entity';
import { TarifDetail } from '../tarif-detail/tarif-detail.entity';

@Entity()
export class GrilleTarif implements IGrilleTarif {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @ManyToOne(type => Franchise)
    @JoinColumn({name: 'idFranchise'})
    franchise: Franchise;

    @ApiModelProperty()
    @Column()
    idFranchise: number;

    @ApiModelProperty()
    @Column()
    reference: string;

    @ApiModelProperty()
    @ManyToOne(type => TypeGrille, { eager: true })
    @JoinColumn({name: 'idTypeGrille'})
    typeGrille: TypeGrille;

    @ApiModelProperty()
    @Column()
    idTypeGrille: number;

    @ApiModelProperty()
    @Column({ default: '', type: 'text' })
    conditions: string;

    @ApiModelProperty()
    @Column({ default: '', type: 'text' })
    commentaire: string;

    @ApiModelProperty()
    @OneToMany(type => TarifDetail, td => td.grilleTarif, { eager: true, onUpdate: 'CASCADE' })
    details: TarifDetail[];

    @ApiModelProperty()
    @Column()
    isGrillePublique: boolean;
}
