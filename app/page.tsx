import { FrequencyWorkbench } from "./components/FrequencyWorkbench";
import { LearningGuide } from "./components/LearningGuide";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Frecuencia Lab, inicio">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Frecuencia Lab</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#calculadora">Calculadora</a>
          <a href="#guia">Mini guía</a>
        </nav>
        <a className="header-cta" href="#calculadora">
          Crear tabla
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">Estadística, paso a paso</span>
          <h1>
            De una lista de datos a una <em>tabla clara.</em>
          </h1>
          <p>
            Escribe tus valores y obtén automáticamente las frecuencias
            absolutas, acumuladas y relativas. Sin fórmulas escondidas.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#calculadora">
              Empezar a calcular <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href="#guia">
              Primero quiero aprender
            </a>
          </div>
        </div>

        <aside className="formula-board" aria-label="Resumen de frecuencias">
          <div className="board-heading">
            <span>Lo esencial</span>
            <span className="board-status">4 conceptos</span>
          </div>
          <div className="formula-grid">
            <article>
              <strong>f<sub>i</sub></strong>
              <span>Frecuencia absoluta</span>
              <small>Cuántas veces aparece</small>
            </article>
            <article>
              <strong>F<sub>i</sub></strong>
              <span>Absoluta acumulada</span>
              <small>La suma hasta esa fila</small>
            </article>
            <article>
              <strong>h<sub>i</sub></strong>
              <span>Frecuencia relativa</span>
              <small>f<sub>i</sub> ÷ n</small>
            </article>
            <article className="formula-accent">
              <strong>H<sub>i</sub></strong>
              <span>Relativa acumulada</span>
              <small>Termina siempre en 1</small>
            </article>
          </div>
        </aside>
      </section>

      <FrequencyWorkbench />
      <LearningGuide />

      <footer>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>Frecuencia Lab</span>
        </div>
        <p>Aprender estadística se vuelve más fácil cuando puedes verla.</p>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </main>
  );
}
