import { NextResponse } from "next/server";
import { PFIF_JSON_SCHEMA, PFIF_RULES } from "@/lib/interop/pfif";

/*
  Publica el estándar común (PFIF) para que las apps de personas se conecten.
  Es DOCUMENTACIÓN (un contrato), no datos: sin PII. El endpoint del buscador
  (`/api/persons/search`) NO se documenta aquí a propósito.
*/
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(
    {
      apiVersion: "v1",
      version: "pfif-subset-1.0",
      standard: "PFIF (Person Finder Interchange Format)",
      schema: PFIF_JSON_SCHEMA,
      rules: PFIF_RULES,
      notes:
        "Adopta este esquema para exponer un endpoint de lectura de personas. busca-vzla federa la búsqueda y enlaza a tu ficha; no almacena PII. Habilitar el buscador requiere acuerdo firmado y cerrar los gates de seguridad.",
    },
    { headers: { "cache-control": "public, s-maxage=3600" } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
