import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, ManyToOne, RelationId} from 'typeorm';
import {IFichier} from '@aleaac/shared';
import {ApiModelProperty} from '@nestjs/swagger';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';
import {Adresse} from '../adresse/adresse.entity';
import {TypeFichier} from '../type-fichier/type-fichier.entity';

@Entity()
export  class Fichier implements IFichier {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({nullable: true})
    idUtilisateur: number;

    @ManyToOne(type => CUtilisateur)
    @JoinColumn({name: 'idUtilisateur'})
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

    @Column()
    @ApiModelProperty()
    extention: string;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    keyDL?: string;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    idTypeFichier: number;

    @ManyToOne(type => TypeFichier)
    @JoinColumn({ name: 'idTypeFichier'})
    @ApiModelProperty()
    typeFichier: TypeFichier;

    @Column({ type: 'text', nullable: true })
    @ApiModelProperty()
    commentaire: string;
}