import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { int } from 'aws-sdk/clients/datapipeline';

export class SimulationActivite1564064883096 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('objectif', [
            new TableColumn({
                name: 'simulationObligatoire',
                type: 'int',
                default: 0
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}