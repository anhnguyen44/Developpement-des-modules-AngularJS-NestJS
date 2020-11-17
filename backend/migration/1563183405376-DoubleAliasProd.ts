import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { int } from 'aws-sdk/clients/datapipeline';

export class DoubleAliasProd1563183405376 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.dropForeignKey('horaires_occupation_locaux', 'FK_b68630c6b37107065ef44fe37f2');
        // await queryRunner.dropIndex('horaires_occupation_locaux', 'FK_b68630c6b37107065ef44fe37f2');
        await queryRunner.renameColumn('horaires_occupation_locaux', 'idZoneIntervention', 'idZIHoraires');
        // await queryRunner.createIndex('horaires_occupation_locaux', new TableIndex({
        //     name: 'FK_b68630c6b37107065ef44fe37f2',
        //     columnNames: ['idZIHoraires']
        // }));
        await queryRunner.createForeignKey('horaires_occupation_locaux', new TableForeignKey({
            columnNames: ['idZIHoraires'],
            referencedColumnNames: ['id'],
            referencedTableName: 'zone_intervention',
            onDelete: 'CASCADE'
        }));

        await queryRunner.dropForeignKey('local_unitaire', 'FK_28f4f1895077709bc278b000c5d');
        // await queryRunner.dropIndex('local_unitaire', 'FK_28f4f1895077709bc278b000c5d');
        await queryRunner.renameColumn('local_unitaire', 'idZoneIntervention', 'idZILocal');
        // await queryRunner.createIndex('local_unitaire', new TableIndex({
        //     name: 'FK_28f4f1895077709bc278b000c5d',
        //     columnNames: ['idZILocal']
        // }));
        await queryRunner.createForeignKey('local_unitaire', new TableForeignKey({
            columnNames: ['idZILocal'],
            referencedColumnNames: ['id'],
            referencedTableName: 'zone_intervention',
            onDelete: 'CASCADE'
        }));

        await queryRunner.dropForeignKey('echantillonnage', 'FK_c54caa8cb39afbf5a978799d15a');
        // await queryRunner.dropIndex('echantillonnage', 'FK_c54caa8cb39afbf5a978799d15a');
        await queryRunner.renameColumn('echantillonnage', 'idZoneIntervention', 'idZIEch');
        // await queryRunner.createIndex('echantillonnage', new TableIndex({
        //     name: 'FK_c54caa8cb39afbf5a978799d15a',
        //     columnNames: ['idZIEch']
        // }));
        await queryRunner.createForeignKey('echantillonnage', new TableForeignKey({
            columnNames: ['idZIEch'],
            referencedColumnNames: ['id'],
            referencedTableName: 'zone_intervention',
            onDelete: 'CASCADE'
        }));

        await queryRunner.dropForeignKey('prelevement', 'FK_ca9917064d29f2de90f70b13c64');
        // await queryRunner.dropIndex('prelevement', 'FK_ca9917064d29f2de90f70b13c64');
        await queryRunner.renameColumn('prelevement', 'idZoneIntervention', 'idZIPrel');
        // await queryRunner.createIndex('prelevement', new TableIndex({
        //     name: 'FK_ca9917064d29f2de90f70b13c64',
        //     columnNames: ['idZIPrel']
        // }));
        await queryRunner.createForeignKey('prelevement', new TableForeignKey({
            columnNames: ['idZIPrel'],
            referencedColumnNames: ['id'],
            referencedTableName: 'zone_intervention',
            onDelete: 'SET NULL'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}