import {MigrationInterface, QueryRunner} from "typeorm";

export class addInsertTypeFichier1565709958942 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('type_fichier_groupe')
            .values([
                {
                    id: '7',
                    nom: 'STAGIAIRE',
                }
            ])
            .execute();

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('type_fichier')
            .values([
                {
                    id: '29',
                    nom: 'Document attaché',
                    affectable: '1',
                    idGroupe: '7'
                }])
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
