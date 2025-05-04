-- AlterTable
ALTER TABLE "Beneficiarios" ADD COLUMN     "beneficiarioCorreo" TEXT;

-- AlterTable
ALTER TABLE "Clientes" ADD COLUMN     "clienteCorreo" TEXT;

-- CreateTable
CREATE TABLE "Pagos" (
    "pagoId" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "fhCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("pagoId")
);

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reservas"("reservaId") ON DELETE RESTRICT ON UPDATE CASCADE;
