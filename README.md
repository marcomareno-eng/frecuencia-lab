# Frecuencia Lab

Aplicación educativa para construir y comprender tablas de distribución de
frecuencias.

## Funciones

- Cálculo automático de `fi`, `Fi`, `hi` y `Hi`.
- Datos agrupados y no agrupados.
- Intervalos sugeridos mediante la regla de Sturges.
- Gráficos de frecuencia absoluta y relativa acumulada.
- Generador aleatorio configurable de 5 a 200 datos.
- Ficha de presentación con variable, datos y verificación del mínimo de 50.
- Guía breve con fórmulas y procedimientos.
- Diseño adaptable para computadoras, tabletas y celulares.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

La lógica estadística está separada de la interfaz en
`app/lib/statistics.ts`, por lo que se pueden añadir nuevas medidas y gráficos
sin rehacer la aplicación.

## Publicación

Cada cambio enviado a la rama `main` construye y publica automáticamente la
versión estática mediante GitHub Pages.
