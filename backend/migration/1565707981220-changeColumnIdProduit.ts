import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class changeColumnIdProduit1565707981220 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.changeColumn('type_formation', 'idProduit', new TableColumn({
            name: 'idProduit',
            type: 'int',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
