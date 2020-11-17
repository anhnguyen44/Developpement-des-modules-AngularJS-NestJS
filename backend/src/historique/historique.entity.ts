import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne, RelationId} from 'typeorm';
import {IHistorique} from '@aleaac/shared';
import {ApiModelProperty} from '@nestjs/swagger';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';

@Entity()
export  class Historique implements IHistorique {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({nullable: true})
    idUser: number;

    @ManyToOne(type => CUtilisateur)
    @JoinColumn({name: 'idUser'})
    utilisateur: CUtilisateur;

    @Column()
    @ApiModelProperty()
    date: Date;

    @Column()
    @ApiModelProperty()
    idParent: number;

    @Column()
    @ApiModelProperty()
    application: string;

    @Column({type: 'text'})
    @ApiModelProperty()
    description: string;
}