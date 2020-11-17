import {MigrationInterface, QueryRunner} from "typeorm";

export class addInsertFonction1565710691775 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('fonction')
            .values([
                {
                    id: '8',
                    nom: 'Formateur',
                },
                {
                    id: '9',
                    nom: 'Préleveur',
                }
            ])
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
