-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "usuarioTipo" INTEGER;

-- CreateTable
CREATE TABLE "UsuarioTipo" (
    "usuarioTipo" SERIAL NOT NULL,
    "usuarioTipoNombre" TEXT,

    CONSTRAINT "UsuarioTipo_pkey" PRIMARY KEY ("usuarioTipo")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioTipo_usuarioTipo_key" ON "UsuarioTipo"("usuarioTipo");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_usuarioTipo_fkey" FOREIGN KEY ("usuarioTipo") REFERENCES "UsuarioTipo"("usuarioTipo") ON DELETE SET NULL ON UPDATE CASCADE;
