export const staticTestResponse = `
1. 🧠 Explicación clara y simple:
Las integrales definidas sirven para calcular el área bajo una curva entre dos puntos en el eje X. Imaginá que tenés una función como una montaña y querés saber cuánta “tierra” hay entre dos posiciones. Eso es lo que hace una integral definida: suma infinitas tiritas de área muy delgadas (rectángulos infinitamente angostos) entre dos valores: un límite inferior y un límite superior.

A diferencia de una integral indefinida (que da una función), la integral definida da un número: ese número representa un área (o algo relacionado, como distancia o volumen, según el contexto).

Si la función está por encima del eje X, el área es positiva. Si está por debajo, da un valor negativo (porque se interpreta como área negativa). Esto también sirve para calcular “áreas netas” o diferencias.

2. 📌 Resumen TL;DR (en 5 frases clave):
- Una integral definida calcula el área bajo una curva entre dos puntos.
- Usa límites de integración: desde un valor a hasta un valor b.
- Se representa como ∫ₐᵇ f(x) dx.
- El resultado es un número real, no una función.
- Se puede interpretar como área, distancia, trabajo o más, dependiendo del caso.

3. 🎯 Ejemplo de la vida real:
Imaginá que un auto acelera con una velocidad variable durante un trayecto. Si conocés cómo varía la velocidad en el tiempo (una función), podés usar una integral definida para calcular cuánta distancia recorrió en ese tiempo exacto.

4. 🗂️ Mapa conceptual (formato Mermaid.js):
\`\`\`mermaid
graph TD
  Integrales --> Definidas
  Integrales --> Indefinidas
  Definidas --> Límites
  Definidas --> Área_bajo_la_curva
  Área_bajo_la_curva --> Interpretación_física
  Definidas --> Regla_Fundamental_del_Cálculo
\`\`\`

5. 🧩 Flashcards para repasar (5–7):
- P: ¿Qué representa una integral definida?  
  R: El área bajo la curva de una función entre dos puntos.

- P: ¿Qué diferencia hay entre una integral definida e indefinida?  
  R: La definida da un número; la indefinida da una función.

- P: ¿Qué significan los límites de integración?  
  R: Son los valores entre los que se calcula el área.

- P: ¿Qué pasa si la función está debajo del eje X?  
  R: El área se considera negativa.

- P: ¿Qué significa ∫ₐᵇ f(x) dx?  
  R: Es la notación de una integral definida desde a hasta b.

- P: ¿Qué te permite calcular la integral definida en física?  
  R: Distancia recorrida, trabajo, energía acumulada, etc.

6. 📘 Guía de estudio adicional:
- Temas relacionados: cálculo diferencial, integrales indefinidas, regla de Barrow, teorema fundamental del cálculo.
- Recursos recomendados:
  - YouTube: “Integrales definidas explicadas fácil” – Math2me o JulioProfe.
  - Khan Academy: “Definite Integrals”.
  - Sitio web: https://www.symbolab.com o https://www.desmos.com/calculator
- Para repasar: Dibujá una función simple como f(x) = x² y sombreá el área entre x = 1 y x = 3. Luego, calculá la integral y compará visualmente.
`.trim();
