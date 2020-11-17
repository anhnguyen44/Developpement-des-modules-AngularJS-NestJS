import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { int } from 'aws-sdk/clients/datapipeline';

export class RepartitionPrelevements1563886469612 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.addColumns('zone_intervention', [
            new TableColumn({
                name: 'repartitionPrelevements',
                type: 'text',
                isNullable: true
            }),
        ]);
        await queryRunner.addColumns('chantier', [
            new TableColumn({
                name: 'commentaire',
                type: 'text',
                isNullable: true
            }),
        ]);
        await queryRunner.addColumns('objectif', [
            new TableColumn({
                name: 'duree',
                type: 'text',
                isNullable: true
            }),
            new TableColumn({
                name: 'frequence',
                type: 'text',
                isNullable: true
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}