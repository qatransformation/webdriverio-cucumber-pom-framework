# SauceDemo Login Feature - Documentation

## 📋 Resumen

Se ha creado una nueva feature completa para probar la funcionalidad de login de la aplicación **SauceDemo** (https://www.saucedemo.com/), priorizando el uso de **Scenario Outline** para maximizar la cobertura de pruebas con diferentes conjuntos de datos.

## 📁 Archivos Creados

### 1. Feature File
**Ubicación:** `features/saucedemo.feature`

**Contenido:**
- ✅ **Scenario Outline** principal con 5 tipos de usuarios válidos
- ✅ **Scenario Outline** para casos negativos (4 casos de error)
- ✅ **Scenario** para usuario bloqueado (locked_out_user)
- ✅ **Scenario** para logout completo

**Tags disponibles:**
- `@saucedemo` - Para todos los tests de SauceDemo
- `@login` - Para tests de login
- `@smoke` - Para tests de smoke
- `@negative` - Para tests negativos
- `@locked` - Para el caso del usuario bloqueado
- `@logout` - Para el test de logout

### 2. Page Object
**Ubicación:** `src/pages/SauceDemoPage.ts`

**Características:**
- ✅ Extiende de `BasePage`
- ✅ Selectores CSS modernos (sin XPath)
- ✅ Métodos para login completo
- ✅ Métodos para logout completo
- ✅ Métodos para validación de errores
- ✅ Métodos para verificar estado de sesión
- ✅ Documentación JSDoc completa

**Métodos principales:**
```typescript
- navigateToLoginPage()
- enterUsername(username: string)
- enterPassword(password: string)
- clickLoginButton()
- login(username, password)  // Método combinado
- getErrorMessage()
- isErrorMessageVisible()
- getProductsTitle()
- isLoggedIn()
- isOnLoginPage()
- logout()  // Método combinado (menu + logout)
```

### 3. Step Definitions
**Ubicación:** `src/steps/saucedemo.steps.ts`

**Steps implementados:**

**GIVEN:**
- `the user navigates to the SauceDemo login page`

**WHEN:**
- `the user enters username {string}`
- `the user enters password {string}`
- `the user clicks the login button`
- `the user clicks the menu button`
- `the user clicks the logout option`

**THEN:**
- `the user should see the {string}`
- `the user should see the error message {string}`
- `the user should be redirected to the login page`
- `the inventory page should be displayed`
- `the user should see {int} products`

### 4. Test Data
**Ubicación:** `test-data/users.json`

**Nuevas secciones agregadas:**
```json
{
  "saucedemoUsers": {
    "valid": [
      // 5 usuarios válidos con descripciones
    ],
    "invalid": [
      // 3 casos de error con mensajes esperados
    ]
  }
}
```

**Usuarios válidos disponibles:**
- `standard_user` - Usuario estándar con acceso completo
- `problem_user` - Usuario con problemas en imágenes
- `performance_glitch_user` - Usuario con problemas de rendimiento
- `error_user` - Usuario con escenarios de error
- `visual_user` - Usuario para testing visual

**Casos de error cubiertos:**
- Usuario bloqueado (locked_out_user)
- Usuario inválido
- Contraseña incorrecta
- Username vacío
- Password vacío

### 5. Configuración Global
**Archivos actualizados:**

**`src/support/world.ts`**
- ✅ Agregado `sauceDemoPage` al CustomWorld
- ✅ Inicialización automática del Page Object

**`src/support/hooks.ts`**
- ✅ Detección inteligente de features por tags
- ✅ Navegación automática a SauceDemo si el tag `@saucedemo` está presente
- ✅ Navegación por defecto a TodoMVC si no hay tag `@saucedemo`

**`src/pages/index.ts`**
- ✅ Exportación de `SauceDemoPage` para fácil importación

## 🧪 Cobertura de Pruebas

### Casos Positivos (Scenario Outline con 5 ejemplos)
1. ✅ Login con `standard_user`
2. ✅ Login con `problem_user`
3. ✅ Login con `performance_glitch_user`
4. ✅ Login con `error_user`
5. ✅ Login con `visual_user`

### Casos Negativos (Scenario Outline con 4 ejemplos)
1. ✅ Usuario inválido con password correcto
2. ✅ Usuario válido con password incorrecto
3. ✅ Username vacío
4. ✅ Password vacío

### Casos Especiales
1. ✅ Usuario bloqueado (locked_out_user)
2. ✅ Logout completo después de login

**Total:** **11 escenarios de prueba**

## 🚀 Comandos de Ejecución

### Ejecutar todos los tests de SauceDemo
```bash
npm run test:open -- --spec=features/saucedemo.feature
```

### Ejecutar solo tests de smoke
```bash
npm run test:open -- --spec=features/saucedemo.feature --cucumberOpts.tagExpression='@smoke'
```

### Ejecutar solo tests de login
```bash
npm run test:open -- --cucumberOpts.tagExpression='@saucedemo and @login'
```

### Ejecutar solo tests negativos
```bash
npm run test:open -- --spec=features/saucedemo.feature --cucumberOpts.tagExpression='@negative'
```

### Ejecutar test de logout
```bash
npm run test:open -- --spec=features/saucedemo.feature --cucumberOpts.tagExpression='@logout'
```

## 📊 Reportes

Los reportes se generan automáticamente en:
```
test-results/executions/{timestamp}/index.html
```

Características del reporte:
- ✅ Videos de evidencia en páginas de features
- ✅ Screenshots automáticos
- ✅ Historial de ejecuciones
- ✅ Servidor HTTP automático en puerto 8080
- ✅ Apertura automática en navegador

## 🎯 Patrón de Diseño

La implementación sigue el **Page Object Model (POM)** con las mejores prácticas:

1. **Separación de responsabilidades**
   - Feature files: Comportamiento en Gherkin
   - Page Objects: Interacciones con la UI
   - Steps: Pegamento entre Gherkin y Page Objects

2. **Reutilización de código**
   - Métodos combinados (`login()`, `logout()`)
   - Herencia de `BasePage`
   - Test data centralizado

3. **Mantenibilidad**
   - Selectores centralizados en Page Objects
   - Documentación JSDoc
   - Nombres descriptivos

4. **Escalabilidad**
   - Fácil agregar nuevos usuarios
   - Fácil agregar nuevos escenarios
   - Sistema de tags flexible

## ✅ Verificación

**Tests ejecutados:** ✅ Pasando
**Videos grabados:** ✅ Sí
**Screenshots capturados:** ✅ Sí
**Reportes generados:** ✅ Sí
**Servidor abierto automáticamente:** ✅ Sí

## 📝 Próximos Pasos (Opcional)

Si deseas extender esta feature, puedes:

1. **Agregar más scenarios:**
   - Validación de productos después del login
   - Agregar productos al carrito
   - Proceso de checkout

2. **Agregar más Page Objects:**
   - `ProductsPage` para la página de inventario
   - `CartPage` para el carrito de compras
   - `CheckoutPage` para el proceso de checkout

3. **Agregar más validaciones:**
   - Verificar cantidad correcta de productos
   - Verificar que los filtros funcionen
   - Verificar que las imágenes se carguen correctamente

## 🔗 Referencias

- **Aplicación bajo prueba:** https://www.saucedemo.com/
- **WebdriverIO:** https://webdriver.io/
- **Cucumber:** https://cucumber.io/
- **Patrón POM:** https://webdriver.io/docs/pageobjects/

---

**Versión del proyecto:** 1.1.0  
**Fecha de creación:** 16 de febrero de 2026  
**Estado:** ✅ Implementado y funcionando
