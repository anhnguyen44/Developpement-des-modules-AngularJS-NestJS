import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn, OneToOne} from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { ITarifDetail } from '@aleaac/shared';
import { GrilleTarif } from '../grille-tarif/grille-tarif.entity';
import { Produit } from '../produit/produit.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';

@Entity()
export class TarifDetail implements ITarifDetail {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => GrilleTarif, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idGrilleTarif' })
    grilleTarif: GrilleTarif;

    @ApiModelProperty()
    @Column()
    idGrilleTarif: number;

    @ApiModelProperty()
    @ManyToOne(type => Produit, { eager: true })
    @JoinColumn({ name: 'idProduit' })
    produit: Produit;

    @ApiModelProperty()
    @Column()
    idProduit: number;

    @ApiModelProperty()
    @Column()
    prixUnitaire: number;

    @ApiModelProperty()
    @Column()
    tempsUnitaire: number;

    @ApiModelProperty()
    @Column()
    uniteTemps: string;

    @ApiModelProperty()
    @ManyToOne(type => CUtilisateur, { nullable: true })
    @JoinColumn({ name: 'idCreatedBy' })
    createdBy?: CUtilisateur;

    @ApiModelProperty()
    @Column({ nullable: true })
    idCreatedBy: number;
}
