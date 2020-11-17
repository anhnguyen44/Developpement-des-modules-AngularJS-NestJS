import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddFormaToDevis1565703247637 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('devis_commande', [
            new TableColumn({
                name: 'idFormation',
                type: 'int',
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
