import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { ITypeFormation } from '@aleaac/shared';
import { TypeFichierGroupe } from '../type-fichier-goupe/type-fichier-groupe.entity';
import { Produit } from '../produit/produit.entity';
import { CDomaineCompetence } from '../domaine-competence/domaine-competence.entity';
import { TFormationDCompetence } from '../tFormation-dCompetence/tFormation-dCompetence.entity';

@Entity()
export class TypeFormation implements ITypeFormation {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nomFormation: string;

    @Column()
    @ApiModelProperty()
    cateFormation: string;

    @Column()
    @ApiModelProperty()
    phrFormation: string;

    @Column()
    @ApiModelProperty()
    foncCible: string;


    @ApiModelProperty()
    @ManyToOne(type => Produit, { nullable: true, cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idProduit' })
    product: Produit;

    @Column()
    @ApiModelProperty()
    phrDiplome: string;

    @Column()
    @ApiModelProperty()
    dureeEnJour: number;

    @Column()
    @ApiModelProperty()
    dureeEnHeure: number;

    @Column()
    @ApiModelProperty()
    dureeValidite: number;

    @Column()
    @ApiModelProperty()
    delaiAmerte: number;

    @Column()
    @ApiModelProperty()
    interne: boolean;

    @Column()
    @ApiModelProperty()
    referentielUtilise: string;

    @OneToMany(type => TFormationDCompetence, tFormationDCompetence => tFormationDCompetence.typeFormation, { eager: true })
    dCompetence: TFormationDCompetence[];


    // @OneToMany(type => TFormationDCompetence, tFormationDCompetence => tFormationDCompetence.typeFormation, { eager: true })
    // dCPratique: TFormationDCompetence[];

    // @OneToMany(type => TFormationDCompetence, tFormationDCompetence => tFormationDCompetence.typeFormation, { eager: true })
    // dCTheorique: TFormationDCompetence[];

    @Column()
    @ApiModelProperty()
    typeEvaluationPratique: string;

    @Column()
    @ApiModelProperty()
    typeEvaluationTheorique: string;
}