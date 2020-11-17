import { ITypeFacturation } from '@aleaac/shared';
import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TypeProduit } from '../type-produit/type-produit.entity';


@Entity()
export class TypeFacturation implements ITypeFacturation {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    nom: string;
}
