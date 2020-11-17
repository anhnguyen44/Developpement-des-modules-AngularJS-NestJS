import { ICodePostal } from '@aleaac/shared';
import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CodePostal implements ICodePostal {
    @Column({ length: 5 })
    @ApiModelProperty()
    numCP: string;

    @Column({ length: 100 })
    @ApiModelProperty()
    nomCommune: string;

    @Column({ length: 100 })
    @ApiModelProperty()
    nomDepartement: string;

    @Column({ length: 40 })
    @ApiModelProperty()
    numDepartement: string;

    @Column({ nullable: true })
    @ApiModelProperty()
    latitude: string;

    @Column({ nullable: true })
    @ApiModelProperty()
    longitude: string;

    @Column({ type: 'bigint', nullable: true })
    @ApiModelProperty()
    nbhabitant: number;

    @Column({ length: 50, nullable: true })
    @ApiModelProperty()
    nomGeofla: string;

    @Column({ length: 5, nullable: true })
    @ApiModelProperty()
    cpGeofla: string;

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

}
