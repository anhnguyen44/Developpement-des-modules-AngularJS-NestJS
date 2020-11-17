import {MigrationInterface, QueryRunner} from "typeorm";

export class removeIsPrelevementMEST1565105662725 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('prelevement', 'isPrelevementMEST');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
