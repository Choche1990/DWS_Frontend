# DigitalWorkSpace

Aplicación web para acceder a herramientas de trabajo y gestionar proyectos, tareas y seguimiento de equipos. Este repositorio contiene el frontend distribuible y el servidor Node.js que ofrece autenticación, almacenamiento del Gantt y generación de documentos.

## Funcionalidades

| Componente | Función |
| --- | --- |
| Portal | Inicio de sesión y acceso a módulos según la cuenta. |
| Gantt | Proyectos, tareas internas, cronograma, tablero de tareas independientes, indicadores y detalle ejecutivo. |
| Equipos | Directorio de responsables y vistas según el rol y los equipos supervisados. |
| Documentos | Generación de Project Charter y acta de aceptación en formato DOCX. |
| Historial | Registro de creación, eliminación y determinados cambios de fechas y estado. |
| Control de accesos | Consulta administrativa de ingresos, fallos de autenticación y visitas al Gantt. |
| Autoatención IA | Dashboard demostrativo con filtros y edición local en el navegador. |
| Process Mining | Módulo incluido en el frontend compilado; este servidor no implementa una API específica de persistencia para él. |

## Arquitectura

El navegador carga `frontend/dist` desde `server.js`. Las operaciones del Gantt utilizan las rutas `/api/...` del mismo servidor. El backend lee y escribe archivos CSV en `backend/data`; no requiere un motor de base de datos externo.

Las sesiones viven en memoria del proceso Node.js. Los proyectos, tareas, cuentas e historiales permanecen en disco al reiniciar.

```text
DWS_Frontend/
├── README.md
├── server.js                       # HTTP, rutas API y archivos del frontend
├── Actualizar-Digital.cmd          # Arranque opcional en Windows
├── backend/
│   ├── sessionStore.js             # Sesiones y permisos de módulo
│   ├── usersStore.js               # Lectura de cuentas y directorio
│   ├── teamScope.js                # Equipos y alcance de supervisión
│   ├── ganttStore.js               # Proyectos y tareas internas
│   ├── independentTasksStore.js    # Tareas independientes
│   ├── auditStore.js               # Historial de cambios
│   ├── csvStore.js                 # Lectura y escritura CSV
│   ├── projectCharterStore.js      # Project Charter DOCX
│   ├── projectAcceptanceStore.js   # Acta de aceptación DOCX
│   ├── templates/                 # Plantillas DOCX versionadas
│   └── data/                      # Seeds versionados y datos locales
├── frontend/dist/                 # Frontend listo para servir
├── gantt-demo.html                 # Variante independiente del Gantt
├── scripts/reorganize-users.js     # Migración excepcional de cuentas
├── tests/                         # Pruebas con datos temporales/simulados
├── docs/                          # Guías de acceso y actualización
└── entrega-jefes/                  # Entrega privada local, excluida de Git
```

## Requisitos y arranque

- Node.js instalado y disponible como `node`.
- Git para sincronizar el código entre máquinas.
- Navegador web y puerto `8080` disponible.
- Permiso de escritura del proceso sobre `backend/data`.

El backend utiliza módulos nativos de Node.js. Este repositorio no contiene un `package.json` ni un flujo de compilación del frontend: para ejecutar esta distribución no se necesita `npm install` ni `npm run build`.

Desde la raíz del repositorio:

```powershell
node --version
node server.js
```

Abrir `http://localhost:8080` e iniciar sesión con una cuenta configurada en `backend/data/users.csv`. Detener el servidor con `Ctrl+C`.

En Windows también puede ejecutarse `Actualizar-Digital.cmd`. Aunque conserva ese nombre, únicamente inicia la aplicación y muestra la indicación para actualizar: no hace `git pull` ni migra cuentas.

El servidor escucha en `0.0.0.0:8080`. Desde otra máquina de la red se utiliza `http://IP_DEL_SERVIDOR:8080`, siempre que la conectividad y el firewall permitan el acceso. El puerto está definido en `server.js`.

### Primera ejecución

Si no existen los archivos reales, se inicializan `projects.csv`, `tasks.csv` y `users.csv` a partir de sus respectivos `.seed.csv`. También se preparan los archivos de tareas independientes y auditoría. Las cuentas seed son de ejemplo: configurar las cuentas reales antes del uso operativo.

Clonar el repositorio crea una instalación con los archivos versionados; no recupera los datos operativos de otra máquina. Para trasladar un servidor completo, detenerlo y transferir su carpeta `backend/data` por un medio privado, conservando un respaldo.

## Cuentas, roles y equipos

Las cuentas se administran en `backend/data/users.csv`. No publicar este archivo ni las contraseñas en Git.

| Campo | Uso |
| --- | --- |
| `email` | Identificador para iniciar sesión. |
| `password` | Contraseña en el formato actual del almacenamiento. |
| `nombre` | Nombre del responsable; se utiliza para relacionar asignaciones. |
| `rol` | `admin`, `owner`, `coordinador`, `jefe` o `analista`. |
| `grupo` | Equipo al que pertenece el usuario. |
| `modulos` | Identificadores separados por comas, por ejemplo `gantt`. |
| `gruposSupervisados` | Equipos de un jefe separados por punto y coma, por ejemplo `datalab;pmo`. |

Los identificadores de módulo reconocidos por el directorio son `gantt`, `process-mining` y `autoatencion-ia`. `*` habilita todos; el administrador recibe todos automáticamente y un campo vacío toma `gantt` como valor predeterminado. Si un campo CSV contiene comas, debe ir entre comillas.

| Rol | Vista del Gantt | Operaciones |
| --- | --- | --- |
| `admin` | General. | Gestión y eliminación; además, consulta del control de accesos. |
| `owner` | General. | Gestión y eliminación del Gantt, sujeto al acceso al módulo. |
| `coordinador` | Responsables de su equipo. | Crear, editar y eliminar proyectos y tareas. |
| `jefe` (líder) | Unión de sus equipos supervisados. | Las mismas operaciones de gestión que coordinador; ya no es solo lectura. |
| `analista` | Asignaciones a su nombre. | Edición operativa; la eliminación de proyectos y tareas está bloqueada por el backend. |

Los equipos predeterminados son DataLab (`datalab`), PMO (`pmo`), SmartDesk (`smartdesk`) y Presupuesto (`presupuesto`). El nombre antiguo `proyectos` se normaliza a `pmo`.

Conservar los nombres de responsables existentes al reorganizar roles: las asignaciones usan esos nombres. Tras cambiar cuentas, reiniciar el servidor y volver a iniciar sesión para cargar la configuración nueva.

**Alcance actual:** los filtros por equipo de la interfaz no constituyen aislamiento completo de datos en la API. El guardado del Gantt envía colecciones completas, y las API de lectura entregan ese estado a los perfiles con acceso al módulo. Hay controles adicionales por equipo para documentos e historial del jefe. No asumir permisos por fila para todas las operaciones.

## Datos y persistencia

| Archivo local | Contenido |
| --- | --- |
| `backend/data/users.csv` | Cuentas, permisos y equipos. |
| `backend/data/projects.csv` | Proyectos y detalle ejecutivo. |
| `backend/data/tasks.csv` | Tareas internas relacionadas mediante `projectId`. |
| `backend/data/independent_tasks.csv` | Tareas independientes. |
| `backend/data/audit_log.csv` | Historial de cambios registrado por la aplicación. |
| `backend/data/access_log.jsonl` | Eventos de autenticación y acceso. |

Los archivos reales anteriores están excluidos de Git. Los `.seed.csv` sí se versionan y solo se usan para inicializar los archivos que faltan.

Respaldar `backend/data` con el servidor detenido antes de migraciones o mantenimiento de datos. No reemplazar datos del servidor con copias antiguas de desarrollo. La migración de usuarios genera respaldos en `backend/data-backup-*`, también excluidos de Git.

La persistencia de Autoatención IA es distinta: sus ediciones se guardan en el `localStorage` de cada navegador, bajo `autoatencion-ia-edits-v2`. No se comparten con otros usuarios ni se respaldan con los CSV del Gantt.

## Actualización entre máquinas con Git

### En desarrollo

Revisar los cambios, incluir los archivos nuevos junto con los modificados y publicar el mismo conjunto de código:

```powershell
git status --short
git add .
git diff --cached --stat
git commit -m "Actualizar DigitalWorkSpace"
git push
```

Los nuevos módulos del backend, pruebas y scripts forman parte de la solución y deben entrar en el commit. `.gitignore` excluye datos reales, `entrega-jefes/`, `claves-usuarios.json` y respaldos de migración.

### En la máquina servidor

Detener Node.js y, desde el repositorio en la misma rama, ejecutar:

```powershell
git status --short
git pull --ff-only
node server.js
```

Si existen cambios locales de código o Git informa una divergencia, revisarlos y resolverlos antes de continuar. No utilizar `reset --hard` como parte del procedimiento normal. Los datos locales ignorados no se sincronizan con `push` ni con `pull`.

### Migración inicial de usuarios, si está pendiente

Este paso solo aplica a la reorganización de cuentas y equipos incluida en `scripts/reorganize-users.js`. No ejecutarlo en cada actualización: contiene perfiles específicos de esa reorganización y podría volver a aplicar sus roles.

Con el servidor detenido:

```powershell
node scripts/reorganize-users.js --check
node scripts/reorganize-users.js
```

Si la revisión informa que faltan contraseñas para cuentas nuevas, proporcionar un archivo JSON privado que relacione correo con contraseña:

```powershell
node scripts/reorganize-users.js --check --passwords .\claves-usuarios.json
node scripts/reorganize-users.js --passwords .\claves-usuarios.json
```

El script respalda los datos, modifica únicamente `users.csv` y comprueba que proyectos, tareas e historial se conserven. Sin archivo de contraseñas conserva las existentes; las contraseñas suministradas explícitamente reemplazan las de esas cuentas.

## Sesiones y control de accesos

- Autenticación validada en el backend; la identidad usada por auditoría procede de la sesión.
- Cookie `HttpOnly` y `SameSite=Strict`.
- Vencimiento por 30 minutos de inactividad o un máximo de 8 horas.
- Reiniciar Node.js invalida todas las sesiones.
- Control de accesos disponible para administradores en `/access-control.html`.

El registro incluye `LOGIN_SUCCESS`, `LOGIN_FAILED`, `LOGOUT`, `SESSION_EXPIRED` y `GANTT_ENTER`. Las visitas al Gantt cuentan cargas del documento, no usuarios simultáneos. No se reconstruyen accesos anteriores a la activación del registro.

El almacenamiento actual conserva contraseñas sin hash en `users.csv`. Para publicar bajo HTTPS, configurar `SESSION_COOKIE_SECURE=true`, incluido cuando HTTPS termina en un proxy:

```powershell
$env:SESSION_COOKIE_SECURE = 'true'
node server.js
```

Esta variable configura la cookie y la validación de origen; no instala certificados ni convierte por sí sola el servidor HTTP en HTTPS. No activarla para una ejecución local exclusivamente HTTP.

## API principal

Salvo el login, las rutas requieren sesión; las operaciones funcionales del Gantt requieren acceso a ese módulo.

| Método | Ruta | Función |
| --- | --- | --- |
| POST | `/api/login` | Iniciar sesión. |
| GET | `/api/session` | Consultar usuario y vencimiento. |
| POST | `/api/session/activity` | Registrar actividad. |
| POST | `/api/logout` | Cerrar sesión. |
| GET | `/api/access-history` | Consultar accesos; solo administrador. |
| GET / POST | `/api/gantt` | Cargar o guardar la colección de proyectos y tareas internas. |
| GET / POST | `/api/independent-tasks` | Cargar o guardar la colección de tareas independientes. |
| POST / DELETE | `/api/independent-task` | Crear/actualizar o eliminar una tarea independiente. |
| GET | `/api/project-history?projectId=ID` | Historial de un proyecto. |
| GET | `/api/project-history?scope=independent&taskId=ID` | Historial de una tarea independiente. |
| GET | `/api/project-charter?projectId=ID` | Descargar Project Charter. |
| POST | `/api/project-acceptance?projectId=ID` | Generar acta; enviar también `projectId` en el cuerpo. El parámetro permite la comprobación de alcance del jefe. |

## Pruebas

```powershell
node --test --test-isolation=none tests/*.test.js
```

Se utiliza el ejecutor nativo de Node.js. La opción `--test-isolation=none` requiere una versión que la soporte y evita crear procesos hijos para cada archivo. Si el entorno no reconoce esa opción, se pueden ejecutar los archivos individualmente, por ejemplo `node tests/session.test.js`.

Las pruebas cubren sesiones, permisos de jefe y coordinador, vistas por equipo en ambas variantes del Gantt, historial, migración de usuarios y respuesta ante recursos estáticos faltantes. Usan datos temporales o simulados.

## Mantenimiento y límites actuales

- `frontend/dist` contiene el frontend compilado. No hay fuentes ni configuración de build completas en este repositorio; una compilación externa debe preservar las integraciones de sesión y Gantt.
- Los cambios comunes del Gantt deben mantenerse consistentes entre `gantt-demo.html` y `frontend/dist/modules/Gantt/gantt.html`. La plataforma sirve el segundo.
- El guardado de colecciones no incorpora resolución de conflictos entre ediciones simultáneas. Un guardado posterior puede reemplazar cambios hechos sobre otro estado.
- El historial registra eventos concretos; no es un versionado completo de todos los campos ni ofrece restauración automática.
- Autoatención IA utiliza recursos de runtime desde CDN; su funcionamiento depende de que esos recursos estén accesibles.
- Servir únicamente archivos estáticos no sustituye al backend de autenticación y persistencia.

## Problemas frecuentes

| Síntoma | Revisión |
| --- | --- |
| `node` no se reconoce | Comprobar instalación de Node.js y `PATH`. |
| Puerto `8080` ocupado | Detener la instancia anterior antes de iniciar otra. |
| Falta `teamScope.js` u otro módulo | Confirmar que los archivos nuevos entraron en el commit y llegaron con el pull. |
| Cuenta o rol desactualizado | Revisar el `users.csv` local del servidor y volver a iniciar sesión tras reiniciar. |
| `401` o redirección al inicio | Iniciar sesión de nuevo; pudo vencer o reiniciarse el servidor. |
| `403` | Revisar módulo autorizado, operación permitida, alcance y origen de la solicitud. |
| `404` en un módulo o asset | Verificar que el archivo existe en `frontend/dist` y está versionado. |
| Pull rechazado | Revisar rama y cambios locales; conservarlos antes de resolver la divergencia. |
| Cambios de IA ausentes en otro equipo | Son locales al navegador, no datos compartidos del servidor. |

## Documentación complementaria

- [Actualización por Git y reorganización de usuarios](docs/actualizacion-jefes.md).
- [Control de accesos y sesiones](docs/access-control.md).
- [Autoatención IA: funcionamiento y persistencia](frontend/dist/modules/AutoatencionIA/README.md).
