import { Franchise, IProduit } from '@aleaac/shared';
import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TypeProduit } from '../type-produit/type-produit.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';


@Entity()
export class Produit implements IProduit {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    nom: string;

    @ApiModelProperty()
    @Column({unique: true})
    code: string;

    @ApiModelProperty()
    @Column()
    description: string;

    @ApiModelProperty()
    @Column({type: 'decimal', precision: 10, scale: 2})
    prixUnitaire: number;

    @ApiModelProperty()
    @Column()
    hasTemps: boolean;

    @ApiModelProperty()
    @Column({type: 'decimal', nullable: true, precision: 10, scale: 2})
    tempsUnitaire: number;

    @ApiModelProperty()
    @Column()
    uniteTemps: string;

    @ApiModelProperty()
    @Column()
    isGeneral: boolean;

    @ApiModelProperty()
    @Column({nullable: true})
    idCreatedBy: number;

    @ApiModelProperty()
    @ManyToOne(type => CUtilisateur, {nullable: true})
    @JoinColumn({name: 'idCreatedBy'})
    createdBy?: CUtilisateur;

    @ApiModelProperty()
    @Column({nullable: true})
    idFranchise: number;

    @ApiModelProperty()
    @ManyToOne(type => CUtilisateur, {nullable: true})
    @JoinColumn({name: 'idFranchise'})
    franchise?: Franchise

    @ApiModelProperty()
    @Column()
    idType: number;

    @ApiModelProperty()
    @ManyToOne(type => TypeProduit, {eager: true})
    @JoinColumn({name: 'idType'})
    type: TypeProduit

    @ApiModelProperty()
    @Column()
    rang: number;
}
