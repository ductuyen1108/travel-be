import { MigrationInterface, QueryRunner } from "typeorm";

export class  deleteSlugUnique1698720130128 implements MigrationInterface {
    name = 'deleteSlugUnique1698720130128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "news_detail" DROP CONSTRAINT "UQ_401ae3c6c35ed9f82e4d72d27d2"`);
        await queryRunner.query(`ALTER TABLE "subject_detail" DROP CONSTRAINT "UQ_df16ba4ab282fcf723c52f63b06"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subject_detail" ADD CONSTRAINT "UQ_df16ba4ab282fcf723c52f63b06" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "news_detail" ADD CONSTRAINT "UQ_401ae3c6c35ed9f82e4d72d27d2" UNIQUE ("slug")`);
    }

}
