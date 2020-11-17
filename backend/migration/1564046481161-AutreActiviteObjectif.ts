import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { int } from 'aws-sdk/clients/datapipeline';

export class AutreActiviteObjectif1564046481161 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.addColumns('zone_intervention', [
            new TableColumn({
                name: 'autreActivite',
                type: 'text',
                isNullable: true
            }),
        ]);

        await queryRunner.addColumns('objectif', [
            new TableColumn({
                name: 'hasTempsCalcule',
                type: 'tinyint',
                default: true
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}