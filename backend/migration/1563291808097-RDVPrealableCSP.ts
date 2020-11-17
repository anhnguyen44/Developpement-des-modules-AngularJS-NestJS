import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { int } from 'aws-sdk/clients/datapipeline';

export class RDVPrealableCSP1563291808097 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.addColumns('chantier', [
            new TableColumn({
                name: 'hasRDVPrealable',
                type: 'tinyint',
                default: false
            }),
            new TableColumn({
                name: 'txtRDVPrealable',
                type: 'text'
            }),
        ]);

        await queryRunner.changeColumn('chantier', 'justifNonCOFRAC', new TableColumn({
            name: 'justifNonCOFRAC',
            type: 'text'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}