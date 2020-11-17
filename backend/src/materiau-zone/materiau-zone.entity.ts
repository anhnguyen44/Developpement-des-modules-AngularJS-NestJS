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
import {
    IMateriauZone
} from '@aleaac/shared';
import { MateriauConstructionAmiante } from '../materiau-construction-amiante/materiau-construction-amiante.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';

@Entity()
export class MateriauZone implements IMateriauZone {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    /**
     * LIAISON
     */
    @ManyToOne(() => MateriauConstructionAmiante, { eager: true, cascade: true, nullable: true })
    @JoinColumn({ name: 'idMateriau' })
    materiau: MateriauConstructionAmiante | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    idMateriau: number | null;

    @ManyToOne(() => ZoneIntervention, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idZoneIntervention' })
    zoneIntervention: ZoneIntervention;

    @Column()
    @ApiModelProperty()
    idZoneIntervention: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    materiauAutre: string | null;

    /**
     * INFOS
     */
    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    etatDegradation: number | null;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    etendueDegradation: number | null;

    @Column({ type: 'text', nullable: true })
    @ApiModelProperty()
    commentaireDegradation: string;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    moyenProtection: number | null;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    etancheiteProtection: number | null;

    @Column({ type: 'text', nullable: true })
    @ApiModelProperty()
    commentaireProtection: string;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    resultatConnu: number | null;

    @Column()
    @ApiModelProperty()
    isInfosNC: boolean;
}
