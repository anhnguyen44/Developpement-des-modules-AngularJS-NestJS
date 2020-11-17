import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { ITypeFichier } from '@aleaac/shared';
import { ITypeFichierGroupe } from '@aleaac/shared';

@Entity()
export class TypeFichierGroupe implements ITypeFichierGroupe {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;
}