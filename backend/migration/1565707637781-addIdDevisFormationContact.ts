import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addIdDevisFormationContact1565707637781 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('formation_contact', [
            new TableColumn({
                name: 'idDevis',
                type: 'int',
                isNullable: true
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
