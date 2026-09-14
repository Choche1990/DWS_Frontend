# Control de accesos

Ejecutar con node server.js y abrir la plataforma en el puerto 8080. La autenticacion requiere este backend; un hosting exclusivamente estatico no ofrece las API de sesion.

- Sesion en memoria del servidor, cookie HttpOnly y SameSite=Strict, sin persistencia de cookie solicitada. Reiniciar el servidor invalida todas las sesiones.
- Expiracion: 30 minutos sin actividad y 8 horas como maximo. Los sondeos automaticos no renuevan la sesion. Eventos de teclado, desplazamiento y pulsacion notifican actividad como maximo cada 15 segundos.
- En HTTPS configurar SESSION_COOKIE_SECURE=true, incluido si TLS termina en un proxy. La publicacion debe usar HTTPS para proteger credenciales y cookies en transito.
- El perfil en localStorage es solo para presentacion. Las API verifican la sesion y el permiso de modulo; la identidad de auditoria proviene de la sesion.
- Se conserva el almacenamiento de contrasenas existente en users.csv. Este cambio no migra contrasenas a hashes ni modifica las reglas existentes de acceso por fila.
- No modificar assets compilados mediante una nueva compilacion sin trasladar primero la integracion de session-client.js y dwsLogout a las fuentes del frontend.

## Registro

backend/data/access_log.jsonl contiene LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, SESSION_EXPIRED y GANTT_ENTER. No registra contrasenas ni tokens. Las expiraciones se detectan al recibir solicitudes.

Administradores: abrir /access-control.html para consultar registros y conteos acumulados mediante GET /api/access-history. Visita al Gantt = solicitud autenticada de /modules/Gantt/gantt.html (incluye recargas); usuarios distintos = correos distintos en esas visitas. No cuenta cada sondeo del Gantt. El archivo se conserva entre reinicios y queda excluido de Git.

## Verificacion

node tests/session.test.js

Prueba HTTP aislada, con usuarios simulados y registro temporal: autenticacion, permisos, origen, cookies, auditoria, expiracion por inactividad y maxima, y cierre de sesion. No modifica los datos reales.

## Publicacion en la PC servidor

Actualizar el repositorio con `git pull --ff-only`, con el servidor detenido, y volver a ejecutar `node server.js`. El codigo nuevo y modificado debe publicarse en el mismo commit. Los datos de `backend/data` permanecen locales. Consultar [el flujo de actualizacion por Git](actualizacion-jefes.md). Todos los usuarios deben iniciar sesion nuevamente despues del reinicio.

El enlace Control de accesos aparece para administradores con sesion validada. Tambien se puede abrir /access-control.html. El informe permite actualizar los conteos. La demo independiente gantt-demo.html no forma parte de la plataforma autenticada.

El registro comienza al desplegar estos cambios; no reconstruye ingresos anteriores. Las visitas incluyen recargas del documento del Gantt, no usuarios simultaneos. El registro es JSONL (una entrada por linea) y permanece en el disco local, sin contrasenas ni tokens.
