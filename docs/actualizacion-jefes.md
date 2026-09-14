# Actualizacion por Git

El codigo, las pruebas y los scripts se versionan juntos. Los datos reales de cada maquina, las claves y los respaldos permanecen locales y estan excluidos por `.gitignore`. No hace falta copiar ZIP ni reemplazar CSV para actualizar el codigo.

## En la maquina de desarrollo

Revisar e incluir tanto archivos modificados como nuevos:

```powershell
git status --short
git add .
git diff --cached --stat
git commit -m "Habilitar gestion para jefes y equipos supervisados"
git push
```

`backend/teamScope.js` es parte del codigo requerido por el servidor y debe entrar en el mismo commit. Las carpetas `tests` y `scripts` tambien se versionan; no requieren instalar dependencias adicionales.

## En la otra maquina

Detener el servidor con Ctrl+C y ejecutar desde el repositorio, en la misma rama:

```powershell
git status --short
git pull --ff-only
node server.js
```

Si hay cambios locales de codigo, revisarlos y conservarlos antes de actualizar. Si Git rechaza el pull, resolver la divergencia sin usar `reset --hard` ni sobrescribir datos. Reiniciar requiere que los usuarios inicien sesion nuevamente.

`Actualizar-Digital.cmd` queda como acceso opcional para iniciar el servidor: no ejecuta Git ni modifica cuentas o contrasenas.

## Usuarios: solo si falta aplicar la reorganizacion

El rol `jefe` tiene permisos operativos de coordinador para crear, editar y eliminar proyectos y tareas. La interfaz filtra sus equipos supervisados. La API entrega el estado completo, como para coordinadores, para conservar los demas equipos durante el guardado.

La configuracion de cuentas vive en `backend/data/users.csv`: Git no la sincroniza entre maquinas. Si la otra maquina ya tiene los perfiles y equipos configurados, basta el pull y el reinicio.

Si todavia falta reorganizar las cuentas, con el servidor detenido:

```powershell
node scripts/reorganize-users.js --check
node scripts/reorganize-users.js
```

La migracion conserva las contrasenas existentes y crea un respaldo en `backend/data-backup-...`. Si la revision indica cuentas nuevas sin contrasena, proporcionar el archivo privado local y repetir la revision antes de aplicar:

```powershell
node scripts/reorganize-users.js --check --passwords .\claves-usuarios.json
node scripts/reorganize-users.js --passwords .\claves-usuarios.json
```

Este paso es excepcional; no se ejecuta en cada pull ni al iniciar el servidor. No copiar los proyectos o tareas de desarrollo sobre los datos de la otra maquina.

## Verificacion

```powershell
node --test --test-isolation=none tests/*.test.js
```
