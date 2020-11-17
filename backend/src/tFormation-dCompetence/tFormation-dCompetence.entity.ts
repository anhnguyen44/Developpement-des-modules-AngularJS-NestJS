import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { TypeFormationDCompetence} from '@aleaac/shared';
import { ApiModelProperty } from "@nestjs/swagger";
import { TypeFormation } from "../type-formation/type-formation.entity";
import { CDomaineCompetence } from "../domaine-competence/domaine-competence.entity";
import { CNoteCompetenceStagiaire } from "../note-competence-stagiaire/note-competence-stagiaire.entity";


@Entity()
export class TFormationDCompetence implements TypeFormationDCompetence{
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    @ManyToOne(type=>TypeFormation,{nullable: true})
    @JoinColumn({name: 'idTypeFormation'})
    typeFormation: TypeFormation;

    @Column()
    @ApiModelProperty()
    idTypeFormation: number;

    @ApiModelProperty()
    @ManyToOne(type=>CDomaineCompetence,{nullable: true})
    @JoinColumn({name: 'idDCompetence'})
    dCompetence: CDomaineCompetence;

    @Column()
    @ApiModelProperty()
    idDCompetence: number;

    @ApiModelProperty()
    @Column({nullable: true})
    typePratique: boolean;

}