import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { int } from 'aws-sdk/clients/datapipeline';

export class NomCommercialBureau1563464223185 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.addColumns('bureau', [
            new TableColumn({
                name: 'nomCommercial',
                type: 'varchar',
                isNullable: true
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}