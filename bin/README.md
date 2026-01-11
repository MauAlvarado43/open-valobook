# Bin Scripts

Scripts ejecutables para facilitar el uso de OpenValoBook.

## Windows (.bat)

```cmd
bin\dev.bat              # Iniciar servidor de desarrollo
bin\electron-dev.bat     # Abrir ventana Electron (requiere dev.bat corriendo)
bin\build.bat            # Compilar Next.js
bin\build-exe.bat        # Generar ejecutable .exe completo
bin\update-assets.bat    # Actualizar assets de Valorant
```

## Linux/Mac (.sh)

```bash
# Primero dar permisos de ejecución:
chmod +x bin/*.sh

# Luego usar:
./bin/dev.sh              # Iniciar servidor de desarrollo
./bin/electron-dev.sh     # Abrir ventana Electron (requiere dev.sh corriendo)
./bin/build.sh            # Compilar Next.js
./bin/build-exe.sh        # Generar ejecutable completo
./bin/update-assets.sh    # Actualizar assets de Valorant
```

## Workflow típico

### Desarrollo web:
```bash
bin\dev.bat              # Solo esto, navega a http://localhost:3001
```

### Desarrollo Electron:
```bash
# Terminal 1
bin\dev.bat

# Terminal 2
bin\electron-dev.bat
```

### Generar EXE para distribución:
```bash
bin\build-exe.bat        # Genera dist/OpenValoBook Setup.exe
```
