-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_beneficiarioId_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_clienteId_fkey";

-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "clienteId" DROP NOT NULL,
ALTER COLUMN "beneficiarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("clienteId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Beneficiarios"("beneficiarioId") ON DELETE SET NULL ON UPDATE CASCADE;
