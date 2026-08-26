# Autoatención IA

Dashboard demostrativo integrado en DigitalWorkSpace como módulo HTML
autocontenido.

## Vistas preservadas

- Resumen Ejecutivo.
- Detalle por categorías y avance contractual frente al real.
- Distribución por responsable y fase.

El dashboard también conserva los filtros por roadmap, responsable y tipo de
automatización, los gráficos interactivos y el panel lateral de edición.

## Archivos de ejecución

- `AutoatencionIA.dc.html`: estructura, vistas y lógica principal.
- `data.js`: datos demostrativos del dashboard.
- `support.js`: runtime necesario para interpretar el formato `.dc.html`.
- `_ds/`: tokens, estilos y tipografías del sistema visual Interbank.

Los documentos, capturas y archivos de trabajo incluidos en el ZIP original no
forman parte de la ejecución y no se incorporaron al módulo.

## Persistencia temporal

Los cambios de estado y fechas realizados desde el panel de edición se guardan
en el `localStorage` del navegador con la clave:

```text
autoatencion-ia-edits-v2
```

Esta persistencia es local al navegador y no se comparte mediante Git ni con
otros usuarios. Cuando exista almacenamiento real, el módulo deberá consumir
endpoints relativos `/api/...` y retirar esta persistencia demostrativa.

## Dependencias del runtime

El runtime actual carga React 18, ReactDOM 18 y Babel Standalone desde un CDN.
Esta dependencia se conserva para no reescribir el artefacto en la primera
integración. Antes de un despliegue con restricciones de red o una política CSP
estricta, estos recursos deberán empaquetarse localmente o el módulo deberá
migrarse al runtime React global.
