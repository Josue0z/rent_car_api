/*
  Warnings:

  - You are about to drop the `ClassificationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Concepts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CostTaxStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailVerifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NcfsTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentsMethods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchasesOrExpenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetentionIsr` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RetentionTax` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Serial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaxPayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaxPayerTypes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Concepts" DROP CONSTRAINT "Concepts_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Concepts" DROP CONSTRAINT "Concepts_classificationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Concepts" DROP CONSTRAINT "Concepts_invoiceTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_documentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_requestId_fkey";

-- DropForeignKey
ALTER TABLE "NcfsTypes" DROP CONSTRAINT "NcfsTypes_serialId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_conceptId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_costTaxStatusId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_ncfsAffectTypeId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_ncfsTypesId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_paymentsMethodsId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_retentionIsrId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_retentionTaxId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_rncOrId_fkey";

-- DropForeignKey
ALTER TABLE "PurchasesOrExpenses" DROP CONSTRAINT "PurchasesOrExpenses_taxPayerTypesId_fkey";

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_requestStatusId_fkey";

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_username_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_username_fkey";

-- DropTable
DROP TABLE "ClassificationType";

-- DropTable
DROP TABLE "Concepts";

-- DropTable
DROP TABLE "CostTaxStatus";

-- DropTable
DROP TABLE "DocumentType";

-- DropTable
DROP TABLE "Documents";

-- DropTable
DROP TABLE "EmailVerifications";

-- DropTable
DROP TABLE "InvoiceType";

-- DropTable
DROP TABLE "NcfsTypes";

-- DropTable
DROP TABLE "PaymentsMethods";

-- DropTable
DROP TABLE "PurchasesOrExpenses";

-- DropTable
DROP TABLE "RequestStatus";

-- DropTable
DROP TABLE "Requests";

-- DropTable
DROP TABLE "RetentionIsr";

-- DropTable
DROP TABLE "RetentionTax";

-- DropTable
DROP TABLE "Serial";

-- DropTable
DROP TABLE "TaxPayer";

-- DropTable
DROP TABLE "TaxPayerTypes";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "Usuarios" (
    "usuarioId" SERIAL NOT NULL,
    "usuarioLogin" TEXT NOT NULL,
    "usuarioClave" TEXT NOT NULL,
    "fhCreacion" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "usuarioPerfil" TEXT,
    "clienteId" INTEGER NOT NULL,
    "beneficiarioId" INTEGER NOT NULL,
    "usuarioEstatus" INTEGER NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("usuarioId")
);

-- CreateTable
CREATE TABLE "UsuarioEstatus" (
    "usuarioEstatus" SERIAL NOT NULL,
    "usuarioEstatusNombre" TEXT NOT NULL,

    CONSTRAINT "UsuarioEstatus_pkey" PRIMARY KEY ("usuarioEstatus")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "clienteId" SERIAL NOT NULL,
    "clienteIdentificacion" TEXT NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "fhCreacion" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "clienteTelefono1" TEXT NOT NULL,
    "clienteTelefono2" TEXT NOT NULL,
    "clientedirId" INTEGER,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("clienteId")
);

-- CreateTable
CREATE TABLE "Beneficiarios" (
    "beneficiarioId" SERIAL NOT NULL,
    "beneficiarioNombre" TEXT NOT NULL,
    "beneficiarioIdentificacion" TEXT NOT NULL,
    "beneficiarioDireccion" TEXT NOT NULL,
    "beneficiarioCoorX" DECIMAL(65,30) NOT NULL,
    "beneficiarioCoorY" DECIMAL(65,30) NOT NULL,
    "bancoId" INTEGER NOT NULL,
    "bancoCuentaTipoId" INTEGER NOT NULL,
    "beneficiarioCuentaNo" TEXT NOT NULL,
    "beneficiarioFecha" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Beneficiarios_pkey" PRIMARY KEY ("beneficiarioId")
);

-- CreateTable
CREATE TABLE "Direcciones" (
    "clientedirId" SERIAL NOT NULL,
    "clientedirNombre" TEXT NOT NULL,
    "clientedirX" DOUBLE PRECISION NOT NULL,
    "clientedirY" DOUBLE PRECISION NOT NULL,
    "clientedirFecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Direcciones_pkey" PRIMARY KEY ("clientedirId")
);

-- CreateTable
CREATE TABLE "Bancos" (
    "bancoId" SERIAL NOT NULL,
    "bancoNombre" TEXT NOT NULL,
    "bancoNota" TEXT,
    "fhCreacion" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bancos_pkey" PRIMARY KEY ("bancoId")
);

-- CreateTable
CREATE TABLE "Colores" (
    "colorId" SERIAL NOT NULL,
    "colorNombre" TEXT NOT NULL,
    "colorHexadecimal" TEXT NOT NULL,

    CONSTRAINT "Colores_pkey" PRIMARY KEY ("colorId")
);

-- CreateTable
CREATE TABLE "Marcas" (
    "marcaId" SERIAL NOT NULL,
    "marcaNombre" TEXT NOT NULL,
    "marcaLogo" TEXT NOT NULL,

    CONSTRAINT "Marcas_pkey" PRIMARY KEY ("marcaId")
);

-- CreateTable
CREATE TABLE "Modelos" (
    "modeloId" SERIAL NOT NULL,
    "modeloNombre" TEXT NOT NULL,
    "marcaId" INTEGER NOT NULL,

    CONSTRAINT "Modelos_pkey" PRIMARY KEY ("modeloId")
);

-- CreateTable
CREATE TABLE "Tarjetas" (
    "tarjetaId" SERIAL NOT NULL,
    "tarjetaNombre" TEXT NOT NULL,
    "tarjetaNumero" TEXT NOT NULL,
    "tarjetaCcv" TEXT NOT NULL,
    "tarjetaVencimiento" TIMESTAMP(3) NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Tarjetas_pkey" PRIMARY KEY ("tarjetaId")
);

-- CreateTable
CREATE TABLE "TipoAuto" (
    "tipoId" SERIAL NOT NULL,
    "tipoNombre" TEXT NOT NULL,

    CONSTRAINT "TipoAuto_pkey" PRIMARY KEY ("tipoId")
);

-- CreateTable
CREATE TABLE "Seguros" (
    "seguroId" SERIAL NOT NULL,
    "seguroNombre" TEXT NOT NULL,
    "seguroMonto" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Seguros_pkey" PRIMARY KEY ("seguroId")
);

-- CreateTable
CREATE TABLE "Valoraciones" (
    "valorId" SERIAL NOT NULL,
    "valorPuntuacion" DECIMAL(65,30) NOT NULL,
    "valorComentario" TEXT NOT NULL,
    "valorFecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autoId" INTEGER NOT NULL,

    CONSTRAINT "Valoraciones_pkey" PRIMARY KEY ("valorId")
);

-- CreateTable
CREATE TABLE "Autos" (
    "autoId" SERIAL NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "marcaId" INTEGER NOT NULL,
    "modeloId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "autoAno" INTEGER NOT NULL,
    "autoDescripcion" TEXT NOT NULL,
    "beneficiarioId" INTEGER NOT NULL,
    "autoFecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autoDireccion" TEXT NOT NULL,
    "autoCoorX" DECIMAL(65,30) NOT NULL,
    "autoCoorY" DECIMAL(65,30) NOT NULL,
    "seguroId" INTEGER,
    "autoKmIncluido" DECIMAL(65,30) NOT NULL,
    "autoCondiciones" TEXT NOT NULL,
    "autoNumeroViajes" INTEGER NOT NULL DEFAULT 0,
    "autoNumeroPersonas" INTEGER NOT NULL DEFAULT 0,
    "autoNumeroPuertas" INTEGER NOT NULL DEFAULT 0,
    "autoNumeroAsientos" INTEGER NOT NULL DEFAULT 0,
    "paisId" INTEGER NOT NULL,
    "provinciaId" INTEGER,
    "ciudadId" INTEGER NOT NULL,
    "precioId" INTEGER NOT NULL,
    "autoEstatus" INTEGER,

    CONSTRAINT "Autos_pkey" PRIMARY KEY ("autoId")
);

-- CreateTable
CREATE TABLE "Imagenes" (
    "imagenId" SERIAL NOT NULL,
    "imagenNota" TEXT NOT NULL,
    "imagenBase64" TEXT NOT NULL,
    "autoId" INTEGER NOT NULL,
    "imagenEstatus" INTEGER NOT NULL,
    "fhCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imagenes_pkey" PRIMARY KEY ("imagenId")
);

-- CreateTable
CREATE TABLE "Documentos" (
    "documentoId" SERIAL NOT NULL,
    "imagenBase64" TEXT NOT NULL,
    "documentoEstatus" INTEGER NOT NULL,
    "documentoTipo" INTEGER NOT NULL,
    "fhCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" INTEGER,
    "beneficiarioId" INTEGER,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Documentos_pkey" PRIMARY KEY ("documentoId")
);

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "documentoTipo" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("documentoTipo")
);

-- CreateTable
CREATE TABLE "DocumentoEstatus" (
    "id" SERIAL NOT NULL,
    "documentoEstatusNombre" TEXT NOT NULL,

    CONSTRAINT "DocumentoEstatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provincias" (
    "provinciaId" SERIAL NOT NULL,
    "provinciaNombre" TEXT NOT NULL,
    "paisId" INTEGER NOT NULL,

    CONSTRAINT "Provincias_pkey" PRIMARY KEY ("provinciaId")
);

-- CreateTable
CREATE TABLE "Ciudades" (
    "ciudadId" SERIAL NOT NULL,
    "ciudadNombre" TEXT NOT NULL,
    "paisId" INTEGER NOT NULL,
    "provinciaId" INTEGER NOT NULL,

    CONSTRAINT "Ciudades_pkey" PRIMARY KEY ("ciudadId")
);

-- CreateTable
CREATE TABLE "Paises" (
    "paisId" INTEGER NOT NULL,
    "paisNombre" TEXT NOT NULL,

    CONSTRAINT "Paises_pkey" PRIMARY KEY ("paisId")
);

-- CreateTable
CREATE TABLE "Reservas" (
    "reservaId" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "beneficiarioId" INTEGER NOT NULL,
    "reservaFhInicial" TIMESTAMP(3) NOT NULL,
    "reservaFhFinal" TIMESTAMP(3) NOT NULL,
    "reservaRecogidaX" DECIMAL(65,30) NOT NULL,
    "reservaRecogidaY" DECIMAL(65,30) NOT NULL,
    "reservaRecogidaDireccion" TEXT NOT NULL,
    "reservaEntregaX" DECIMAL(65,30) NOT NULL,
    "reservaEntregaY" DECIMAL(65,30) NOT NULL,
    "reservaEntregaDireccion" TEXT NOT NULL,
    "reservaMontoxDias" INTEGER NOT NULL,
    "reservaMonto" DECIMAL(65,30) NOT NULL,
    "reservaAbono" DECIMAL(65,30) NOT NULL,
    "reservaNotaCliente" TEXT NOT NULL,
    "reservaNotaBeneficiario" TEXT NOT NULL,
    "reservaMontoTotal" DECIMAL(65,30) NOT NULL,
    "reservaPagado" DECIMAL(65,30) NOT NULL,
    "reservaImpuestos" DECIMAL(65,30) NOT NULL,
    "reservaDescuento" DECIMAL(65,30) NOT NULL,
    "reservaCreado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservaNumero" INTEGER,
    "autoId" INTEGER NOT NULL,
    "tarjetaId" INTEGER NOT NULL,
    "reservaEstatus" INTEGER NOT NULL,

    CONSTRAINT "Reservas_pkey" PRIMARY KEY ("reservaId")
);

-- CreateTable
CREATE TABLE "ReservaEstatus" (
    "reservaEstatus" SERIAL NOT NULL,
    "reservaEstatusNombre" TEXT NOT NULL,

    CONSTRAINT "ReservaEstatus_pkey" PRIMARY KEY ("reservaEstatus")
);

-- CreateTable
CREATE TABLE "BancoCuentaTipo" (
    "bancoCuentaTipoId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BancoCuentaTipo_pkey" PRIMARY KEY ("bancoCuentaTipoId")
);

-- CreateTable
CREATE TABLE "Precios" (
    "precioId" SERIAL NOT NULL,
    "precioNombre" TEXT NOT NULL,
    "precioCliente" DECIMAL(65,30) NOT NULL,
    "precioBeneficiario" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Precios_pkey" PRIMARY KEY ("precioId")
);

-- CreateTable
CREATE TABLE "AutoEstatus" (
    "autoEstatus" SERIAL NOT NULL,
    "autoEstatusNombre" TEXT NOT NULL,

    CONSTRAINT "AutoEstatus_pkey" PRIMARY KEY ("autoEstatus")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_usuarioId_key" ON "Usuarios"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_usuarioLogin_key" ON "Usuarios"("usuarioLogin");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEstatus_usuarioEstatus_key" ON "UsuarioEstatus"("usuarioEstatus");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEstatus_usuarioEstatusNombre_key" ON "UsuarioEstatus"("usuarioEstatusNombre");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_clienteId_key" ON "Clientes"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_clienteIdentificacion_key" ON "Clientes"("clienteIdentificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_clienteTelefono1_key" ON "Clientes"("clienteTelefono1");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_clienteTelefono2_key" ON "Clientes"("clienteTelefono2");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiarios_beneficiarioId_key" ON "Beneficiarios"("beneficiarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiarios_beneficiarioIdentificacion_key" ON "Beneficiarios"("beneficiarioIdentificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiarios_beneficiarioCuentaNo_key" ON "Beneficiarios"("beneficiarioCuentaNo");

-- CreateIndex
CREATE UNIQUE INDEX "Direcciones_clientedirId_key" ON "Direcciones"("clientedirId");

-- CreateIndex
CREATE UNIQUE INDEX "Bancos_bancoId_key" ON "Bancos"("bancoId");

-- CreateIndex
CREATE UNIQUE INDEX "Colores_colorId_key" ON "Colores"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "Marcas_marcaId_key" ON "Marcas"("marcaId");

-- CreateIndex
CREATE UNIQUE INDEX "Marcas_marcaNombre_key" ON "Marcas"("marcaNombre");

-- CreateIndex
CREATE UNIQUE INDEX "Modelos_modeloId_key" ON "Modelos"("modeloId");

-- CreateIndex
CREATE UNIQUE INDEX "Modelos_modeloNombre_key" ON "Modelos"("modeloNombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tarjetas_tarjetaId_key" ON "Tarjetas"("tarjetaId");

-- CreateIndex
CREATE UNIQUE INDEX "Tarjetas_tarjetaNumero_key" ON "Tarjetas"("tarjetaNumero");

-- CreateIndex
CREATE UNIQUE INDEX "Tarjetas_tarjetaCcv_key" ON "Tarjetas"("tarjetaCcv");

-- CreateIndex
CREATE UNIQUE INDEX "TipoAuto_tipoId_key" ON "TipoAuto"("tipoId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoAuto_tipoNombre_key" ON "TipoAuto"("tipoNombre");

-- CreateIndex
CREATE UNIQUE INDEX "Seguros_seguroId_key" ON "Seguros"("seguroId");

-- CreateIndex
CREATE UNIQUE INDEX "Seguros_seguroNombre_key" ON "Seguros"("seguroNombre");

-- CreateIndex
CREATE UNIQUE INDEX "Valoraciones_valorId_key" ON "Valoraciones"("valorId");

-- CreateIndex
CREATE UNIQUE INDEX "Autos_autoId_key" ON "Autos"("autoId");

-- CreateIndex
CREATE UNIQUE INDEX "Imagenes_imagenId_key" ON "Imagenes"("imagenId");

-- CreateIndex
CREATE UNIQUE INDEX "Documentos_documentoId_key" ON "Documentos"("documentoId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_documentoTipo_key" ON "TipoDocumento"("documentoTipo");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentoEstatus_id_key" ON "DocumentoEstatus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Provincias_provinciaId_key" ON "Provincias"("provinciaId");

-- CreateIndex
CREATE UNIQUE INDEX "Ciudades_ciudadId_key" ON "Ciudades"("ciudadId");

-- CreateIndex
CREATE UNIQUE INDEX "Paises_paisId_key" ON "Paises"("paisId");

-- CreateIndex
CREATE UNIQUE INDEX "Paises_paisNombre_key" ON "Paises"("paisNombre");

-- CreateIndex
CREATE UNIQUE INDEX "Reservas_reservaId_key" ON "Reservas"("reservaId");

-- CreateIndex
CREATE UNIQUE INDEX "ReservaEstatus_reservaEstatus_key" ON "ReservaEstatus"("reservaEstatus");

-- CreateIndex
CREATE UNIQUE INDEX "BancoCuentaTipo_bancoCuentaTipoId_key" ON "BancoCuentaTipo"("bancoCuentaTipoId");

-- CreateIndex
CREATE UNIQUE INDEX "BancoCuentaTipo_name_key" ON "BancoCuentaTipo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Precios_precioId_key" ON "Precios"("precioId");

-- CreateIndex
CREATE UNIQUE INDEX "Precios_precioNombre_key" ON "Precios"("precioNombre");

-- CreateIndex
CREATE UNIQUE INDEX "AutoEstatus_autoEstatus_key" ON "AutoEstatus"("autoEstatus");

-- CreateIndex
CREATE UNIQUE INDEX "AutoEstatus_autoEstatusNombre_key" ON "AutoEstatus"("autoEstatusNombre");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("clienteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Beneficiarios"("beneficiarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_usuarioEstatus_fkey" FOREIGN KEY ("usuarioEstatus") REFERENCES "UsuarioEstatus"("usuarioEstatus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_clientedirId_fkey" FOREIGN KEY ("clientedirId") REFERENCES "Direcciones"("clientedirId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiarios" ADD CONSTRAINT "Beneficiarios_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "Bancos"("bancoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiarios" ADD CONSTRAINT "Beneficiarios_bancoCuentaTipoId_fkey" FOREIGN KEY ("bancoCuentaTipoId") REFERENCES "BancoCuentaTipo"("bancoCuentaTipoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direcciones" ADD CONSTRAINT "Direcciones_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("clienteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modelos" ADD CONSTRAINT "Modelos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marcas"("marcaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarjetas" ADD CONSTRAINT "Tarjetas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("clienteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valoraciones" ADD CONSTRAINT "Valoraciones_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "Autos"("autoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoAuto"("tipoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marcas"("marcaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "Modelos"("modeloId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Colores"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Beneficiarios"("beneficiarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_seguroId_fkey" FOREIGN KEY ("seguroId") REFERENCES "Seguros"("seguroId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Paises"("paisId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincias"("provinciaId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "Ciudades"("ciudadId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_precioId_fkey" FOREIGN KEY ("precioId") REFERENCES "Precios"("precioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Autos" ADD CONSTRAINT "Autos_autoEstatus_fkey" FOREIGN KEY ("autoEstatus") REFERENCES "AutoEstatus"("autoEstatus") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagenes" ADD CONSTRAINT "Imagenes_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "Autos"("autoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagenes" ADD CONSTRAINT "Imagenes_imagenEstatus_fkey" FOREIGN KEY ("imagenEstatus") REFERENCES "DocumentoEstatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentos" ADD CONSTRAINT "Documentos_documentoEstatus_fkey" FOREIGN KEY ("documentoEstatus") REFERENCES "DocumentoEstatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentos" ADD CONSTRAINT "Documentos_documentoTipo_fkey" FOREIGN KEY ("documentoTipo") REFERENCES "TipoDocumento"("documentoTipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentos" ADD CONSTRAINT "Documentos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("clienteId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentos" ADD CONSTRAINT "Documentos_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Beneficiarios"("beneficiarioId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentos" ADD CONSTRAINT "Documentos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuarios"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincias" ADD CONSTRAINT "Provincias_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Paises"("paisId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ciudades" ADD CONSTRAINT "Ciudades_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Paises"("paisId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ciudades" ADD CONSTRAINT "Ciudades_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincias"("provinciaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Clientes"("clienteId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "Beneficiarios"("beneficiarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_autoId_fkey" FOREIGN KEY ("autoId") REFERENCES "Autos"("autoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_tarjetaId_fkey" FOREIGN KEY ("tarjetaId") REFERENCES "Tarjetas"("tarjetaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_reservaEstatus_fkey" FOREIGN KEY ("reservaEstatus") REFERENCES "ReservaEstatus"("reservaEstatus") ON DELETE RESTRICT ON UPDATE CASCADE;
