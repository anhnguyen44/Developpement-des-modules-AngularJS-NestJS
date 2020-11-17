import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { INoteCompetenceStagiaire } from '@aleaac/shared';
import { CFormationContact } from '../formation-contact/formation-contact.entity';
import { TFormationDCompetence } from '../tFormation-dCompetence/tFormation-dCompetence.entity';

@Entity({name: 'note_competence_stagiaire'})
export class CNoteCompetenceStagiaire implements INoteCompetenceStagiaire{

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({nullable: true})
    @ApiModelProperty()
    idStagiaire: number;

    @ApiModelProperty()
    @ManyToOne(type => CFormationContact, formation => formation.noteCompetence, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'idStagiaire'})
    stagiaire: CFormationContact;

    @Column({nullable: true})
    @ApiModelProperty()
    idCompetence: number;

    @ApiModelProperty()
    @ManyToOne(type => TFormationDCompetence, { primary: true, eager: true })
    @JoinColumn({name: 'idCompetence'})
    competence: TFormationDCompetence;

    @ApiModelProperty()
    @Column()
    note: number;
}