/*
  Warnings:

  - You are about to drop the column `bancoCuentaTipoId` on the `Beneficiarios` table. All the data in the column will be lost.
  - Added the required column `beneficiarioCuentaTipo` to the `Beneficiarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Beneficiarios" DROP CONSTRAINT "Beneficiarios_bancoCuentaTipoId_fkey";

-- AlterTable
ALTER TABLE "Beneficiarios" DROP COLUMN "bancoCuentaTipoId",
ADD COLUMN     "beneficiarioCuentaTipo" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Beneficiarios" ADD CONSTRAINT "Beneficiarios_beneficiarioCuentaTipo_fkey" FOREIGN KEY ("beneficiarioCuentaTipo") REFERENCES "BancoCuentaTipo"("bancoCuentaTipoId") ON DELETE RESTRICT ON UPDATE CASCADE;
