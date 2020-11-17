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
import { ITemplateVersion } from '@aleaac/shared';
import { Fichier } from '../fichier/fichier.entity';

@Entity()
export class TemplateVersion implements ITemplateVersion {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ManyToOne(() => Fichier, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idFichier' })
    fichier: Fichier;

    @Column({ nullable: true })
    @ApiModelProperty()
    idFichier: number;

    @Column()
    @ApiModelProperty()
    typeTemplate: number;

    @Column()
    @ApiModelProperty()
    dateDebut: Date;

    @Column()
    @ApiModelProperty()
    version: number;

    @Column()
    @ApiModelProperty()
    isTest: boolean;
}
