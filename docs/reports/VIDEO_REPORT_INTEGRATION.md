# 🎥 Videos en el Framework - Guía Rápida

## ✅ Configuración Actual

Los videos se graban automáticamente para todas las ejecuciones pero **NO se embeben** en los reportes HTML.

**Razón:** Los reportes se mantienen simples y rápidos de cargar. Los videos están disponibles en las carpetas de ejecución para revisión manual cuando sea necesario.

## 🚀 Cómo Acceder a los Videos

### 1. Ejecutar Tests
```bash
npm test
```

### 2. Localizar los Videos

Los videos se guardan en:
```bash
test-results/executions/[timestamp]/videos/
```

### 3. Reproducir Videos

**Opción 1: Finder/File Explorer**
1. Navega a `test-results/executions/`
2. Abre la carpeta de la ejecución (ej: `2026-02-16_19-42-50`)
3. Entra a la carpeta `videos/`
4. Haz doble clic en cualquier archivo `.webm` para reproducirlo

**Opción 2: Terminal**
```bash
# Listar videos disponibles
ls test-results/executions/*/videos/*.webm

# Abrir un video específico (macOS)
open test-results/executions/2026-02-16_19-42-50/videos/Add-and-manage-complete-tasks-0-0--CHROME--02-16-2026--19-42-54.webm
```

**Opción 3: Navegador**
1. Abre Chrome o Firefox
2. Arrastra el archivo `.webm` a la ventana del navegador
3. El video se reproducirá automáticamente

## 🔧 Cómo Funciona

### Grabación Automática

El sistema graba videos automáticamente:

1. **wdio.conf.ts** configura wdio-video-reporter
2. Los videos se graban durante la ejecución de tests
3. Se guardan en `test-results/executions/[timestamp]/videos/`
4. **post-process-report.js** NO inyecta videos (grabación solamente)
5. Videos disponibles para revisión manual cuando sea necesario

### Configuración

```typescript
// wdio.conf.ts
reporters: [
    'spec',
    [video, {
        saveAllVideos: true,
        outputDir: `${executionDir}/videos/`,
        maxTestNameLength: 100
    }]
]
```

## 📊 Verificación

Para verificar que los videos están disponibles:

```bash
# Listar todos los videos grabados
ls -lh test-results/executions/*/videos/*.webm

# Ver cuántos videos hay en la última ejecución
ls test-results/executions/$(ls -t test-results/executions/ | head -1)/videos/ | wc -l

# Abrir carpeta de videos de la última ejecución
open test-results/executions/$(ls -t test-results/executions/ | head -1)/videos/
```
## 🎯 Resultado

Cuando ejecutas `npm test`:

1. ✅ Tests se ejecutan
2. ✅ Videos se graban automáticamente
3. ✅ Reporte HTML se genera
4. ✅ Videos quedan disponibles en carpetas de ejecución
5. ✅ Acceso manual a videos cuando sea necesario

## 📂 Archivos del Sistema

### Archivos Principales
- **src/reports/post-process-report.js**: Procesa reportes (paths y scenarios)
- **src/reports/generate-report.js**: Genera reportes HTML
- **src/reports/generate-index.js**: Genera índice de ejecuciones
- **wdio.conf.ts**: Configuración de grabación de videos

## 🔍 Solución de Problemas

### No se graban videos

**Verificar:**
```bash
# 1. Verificar que existen videos
ls test-results/executions/*/videos/*.webm

# 2. Verificar configuración
grep "saveAllVideos" wdio.conf.ts

# 3. Verificar reporter
grep "video" wdio.conf.ts
```

### Error al ejecutar tests

Asegúrate de que:
- wdio-video-reporter está instalado
- La configuración en wdio.conf.ts es correcta
- La carpeta de ejecución se crea correctamente

## 💡 Tips

1. **Ubicación**: Videos siempre en `test-results/executions/[timestamp]/videos/`
2. **Formato**: WebM - compatible con la mayoría de navegadores y reproductores
3. **Nombres**: Incluyen nombre de scenario, browser y timestamp
4. **Acceso**: Navega a la carpeta o arrastra al navegador
5. **Limpieza**: Elimina carpetas de ejecuciones antiguas para liberar espacio

## ✅ Resumen

**Configuración Actual:**
- ✅ Videos se graban automáticamente
- ✅ Guardados en carpetas de ejecución
- ✅ NO embebidos en reportes HTML
- ✅ Reportes más rápidos y simples
- ✅ Videos accesibles para revisión manual

**Ventajas:**
- Reportes cargan más rápido
- Menor uso de memoria del navegador
- Videos disponibles cuando realmente se necesitan
- Estructura de archivos más clara

---

**Estado**: ✅ FUNCIONANDO  
**Videos disponibles**: 11  
**Post-procesamiento**: Automático  
**Compatibilidad**: Todos los navegadores modernos
