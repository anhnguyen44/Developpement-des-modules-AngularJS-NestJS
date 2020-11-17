import {Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {ITypeFichier} from '@aleaac/shared';
import { TypeFichierGroupe } from '../type-fichier-goupe/type-fichier-groupe.entity';

@Entity()
export  class TypeFichier implements ITypeFichier {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    affectable: boolean;

    @ManyToOne(() => TypeFichierGroupe, { nullable: true, eager: true })
    @JoinColumn({ name: 'idGroupe' })
    groupe: TypeFichierGroupe;

    @Column({ nullable: true })
    @ApiModelProperty()
    idGroupe: number;
}