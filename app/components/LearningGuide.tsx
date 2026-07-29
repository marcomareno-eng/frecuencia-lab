const concepts = [
  {
    symbol: "fᵢ",
    name: "Frecuencia absoluta",
    description: "Cuenta cuántas veces aparece un valor o cae un dato en un intervalo.",
    formula: "conteo",
  },
  {
    symbol: "Fᵢ",
    name: "Frecuencia acumulada",
    description: "Suma la frecuencia actual con todas las frecuencias anteriores.",
    formula: "Fᵢ₋₁ + fᵢ",
  },
  {
    symbol: "hᵢ",
    name: "Frecuencia relativa",
    description: "Muestra qué parte del total representa cada frecuencia.",
    formula: "fᵢ / n",
  },
  {
    symbol: "Hᵢ",
    name: "Relativa acumulada",
    description: "Acumula las proporciones; la última fila debe ser igual a 1.",
    formula: "Hᵢ₋₁ + hᵢ",
  },
];

export function LearningGuide() {
  return (
    <section className="guide-section" id="guia">
      <div className="section-intro guide-intro">
        <div>
          <span className="eyebrow">Mini guía</span>
          <h2>Entiende antes de memorizar</h2>
        </div>
        <p>
          Las cuatro columnas cuentan la misma historia desde perspectivas
          distintas.
        </p>
      </div>

      <div className="concept-grid">
        {concepts.map((concept, index) => (
          <article key={concept.symbol}>
            <span className="concept-index">0{index + 1}</span>
            <strong>{concept.symbol}</strong>
            <h3>{concept.name}</h3>
            <p>{concept.description}</p>
            <code>{concept.formula}</code>
          </article>
        ))}
      </div>

      <div className="guide-columns">
        <article className="method-card">
          <div className="method-title">
            <span>A</span>
            <div>
              <small>Procedimiento</small>
              <h3>Datos no agrupados</h3>
            </div>
          </div>
          <ol>
            <li>
              <span>1</span>
              <p>
                <strong>Ordena los valores</strong>
                Escribe cada valor diferente de menor a mayor.
              </p>
            </li>
            <li>
              <span>2</span>
              <p>
                <strong>Cuenta cada aparición</strong>
                Ese conteo forma la columna f<sub>i</sub>.
              </p>
            </li>
            <li>
              <span>3</span>
              <p>
                <strong>Acumula y divide</strong>
                Suma para obtener F<sub>i</sub> y divide f<sub>i</sub> entre n
                para hallar h<sub>i</sub>.
              </p>
            </li>
            <li>
              <span>4</span>
              <p>
                <strong>Comprueba</strong>
                Σf<sub>i</sub> = n, Σh<sub>i</sub> = 1 y la última H
                <sub>i</sub> = 1.
              </p>
            </li>
          </ol>
        </article>

        <article className="method-card method-card-accent">
          <div className="method-title">
            <span>B</span>
            <div>
              <small>Procedimiento</small>
              <h3>Datos agrupados</h3>
            </div>
          </div>
          <ol>
            <li>
              <span>1</span>
              <p>
                <strong>Calcula el rango</strong>
                R = valor máximo − valor mínimo.
              </p>
            </li>
            <li>
              <span>2</span>
              <p>
                <strong>Decide las clases</strong>
                Puedes usar Sturges: k ≈ 1 + 3,322 log(n).
              </p>
            </li>
            <li>
              <span>3</span>
              <p>
                <strong>Halla la amplitud</strong>
                A ≈ R ÷ k y redondea hacia arriba a un valor cómodo.
              </p>
            </li>
            <li>
              <span>4</span>
              <p>
                <strong>Cuenta y completa</strong>
                Cuenta los datos por intervalo y calcula fi, Fi, hi y Hi como
                antes.
              </p>
            </li>
          </ol>
        </article>
      </div>

      <div className="check-strip">
        <div>
          <span aria-hidden="true">✓</span>
          <p>
            <strong>Comprobación rápida</strong>
            Si el total de f<sub>i</sub> es n y la última H<sub>i</sub> es 1,
            vas por buen camino.
          </p>
        </div>
        <a href="#calculadora">Probar con mis datos →</a>
      </div>

      <blockquote className="verse-card">
        <span>Aprender también es crecer</span>
        <p>
          “Oirá el sabio, y aumentará el saber; y el entendido adquirirá
          consejo.”
        </p>
        <cite>Proverbios 1:5 · Reina-Valera Antigua</cite>
      </blockquote>
    </section>
  );
}
