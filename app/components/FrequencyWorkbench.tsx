"use client";

import { useMemo, useState } from "react";
import { DistributionChart } from "./DistributionChart";
import {
  buildGrouped,
  buildUngrouped,
  formatNumber,
  parseData,
  sturgesClassCount,
  type DataMode,
} from "../lib/statistics";

const EXAMPLES = {
  ungrouped: "12, 14, 14, 15, 16, 16, 16, 18, 19, 20, 20, 22",
  grouped:
    "42, 45, 48, 51, 53, 54, 55, 57, 58, 61, 62, 64, 66, 68, 69, 72, 74, 76, 78, 81",
};

export function FrequencyWorkbench() {
  const [mode, setMode] = useState<DataMode>("ungrouped");
  const [input, setInput] = useState(EXAMPLES.ungrouped);
  const [classCount, setClassCount] = useState(5);
  const [metric, setMetric] = useState<"fi" | "Hi">("fi");
  const [variableName, setVariableName] = useState("Edad de los estudiantes");
  const [randomCount, setRandomCount] = useState(50);
  const [randomMinimum, setRandomMinimum] = useState(10);
  const [randomMaximum, setRandomMaximum] = useState(25);
  const [useDecimals, setUseDecimals] = useState(false);
  const [generatorError, setGeneratorError] = useState("");

  const values = useMemo(() => parseData(input), [input]);
  const suggestedClasses = sturgesClassCount(values.length);
  const result = useMemo(
    () =>
      mode === "ungrouped"
        ? buildUngrouped(values)
        : buildGrouped(values, classCount),
    [classCount, mode, values],
  );

  function switchMode(nextMode: DataMode) {
    setMode(nextMode);
    setInput(EXAMPLES[nextMode]);
    setMetric("fi");
    if (nextMode === "grouped") setClassCount(5);
  }

  function useExample() {
    setInput(EXAMPLES[mode]);
  }

  function generateRandomData() {
    const normalizedCount = Math.round(randomCount);

    if (
      !Number.isFinite(normalizedCount) ||
      normalizedCount < 5 ||
      normalizedCount > 200
    ) {
      setGeneratorError("Elige una cantidad entre 5 y 200 datos.");
      return;
    }

    if (
      !Number.isFinite(randomMinimum) ||
      !Number.isFinite(randomMaximum) ||
      Math.abs(randomMinimum) > 1_000_000 ||
      Math.abs(randomMaximum) > 1_000_000 ||
      randomMinimum >= randomMaximum
    ) {
      setGeneratorError(
        "Usa un mínimo menor que el máximo, entre −1 000 000 y 1 000 000.",
      );
      return;
    }

    const precision = useDecimals ? 10 : 1;
    const lower = Math.ceil(randomMinimum * precision);
    const upper = Math.floor(randomMaximum * precision);

    if (lower > upper) {
      setGeneratorError("Ese rango no permite generar los valores elegidos.");
      return;
    }

    const generatedValues = Array.from({ length: normalizedCount }, () => {
      const randomValue =
        Math.floor(Math.random() * (upper - lower + 1)) + lower;
      return randomValue / precision;
    });

    setInput(generatedValues.join(", "));
    setRandomCount(normalizedCount);
    setGeneratorError("");
  }

  return (
    <section className="workbench-section" id="calculadora">
      <div className="section-intro">
        <div>
          <span className="eyebrow">Calculadora interactiva</span>
          <h2>Construye tu tabla</h2>
        </div>
        <p>
          Elige el tipo de datos, pega tus valores y observa cómo se forma cada
          columna.
        </p>
      </div>

      <div className="assignment-callout">
        <span aria-hidden="true">50+</span>
        <div>
          <strong>Modo presentación</strong>
          <p>
            Especifica la variable, incluye un mínimo de 50 datos y presenta la
            tabla de distribución completa.
          </p>
        </div>
      </div>

      <div className="workbench">
        <div className="mode-switch" role="tablist" aria-label="Tipo de datos">
          <button
            aria-selected={mode === "ungrouped"}
            className={mode === "ungrouped" ? "active" : ""}
            onClick={() => switchMode("ungrouped")}
            role="tab"
            type="button"
          >
            <span>01</span>
            Datos no agrupados
          </button>
          <button
            aria-selected={mode === "grouped"}
            className={mode === "grouped" ? "active" : ""}
            onClick={() => switchMode("grouped")}
            role="tab"
            type="button"
          >
            <span>02</span>
            Datos agrupados
          </button>
        </div>

        <div className="workbench-grid">
          <aside className="data-panel">
            <div className="panel-heading">
              <div>
                <span className="step-number">1</span>
                <div>
                  <h3>Ingresa los datos</h3>
                  <p>Una lista de valores numéricos</p>
                </div>
              </div>
              <button className="example-button" onClick={useExample} type="button">
                Usar ejemplo
              </button>
            </div>

            <label htmlFor="variable-name">Variable a estudiar</label>
            <input
              className="text-input"
              id="variable-name"
              maxLength={80}
              onChange={(event) => setVariableName(event.target.value)}
              placeholder="Ej.: Edad de los estudiantes"
              type="text"
              value={variableName}
            />

            <label htmlFor="dataset">Tus valores</label>
            <textarea
              id="dataset"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ej.: 8, 10, 10, 12, 15"
              spellCheck={false}
              value={input}
            />
            <p className="input-help">
              Separa con comas, espacios o saltos de línea. Usa punto para
              decimales.
            </p>

            <div className="random-generator">
              <div className="generator-heading">
                <div>
                  <strong>Generador de práctica</strong>
                  <small>Crea una muestra aleatoria sin escribirla a mano.</small>
                </div>
                <span>Máx. 200</span>
              </div>

              <div className="preset-row" aria-label="Cantidades rápidas">
                {[30, 50, 100].map((amount) => (
                  <button
                    className={randomCount === amount ? "active" : ""}
                    key={amount}
                    onClick={() => setRandomCount(amount)}
                    type="button"
                  >
                    {amount} datos
                  </button>
                ))}
              </div>

              <div className="generator-fields">
                <label>
                  <span>Cantidad</span>
                  <input
                    max="200"
                    min="5"
                    onChange={(event) => setRandomCount(Number(event.target.value))}
                    type="number"
                    value={randomCount}
                  />
                </label>
                <label>
                  <span>Mínimo</span>
                  <input
                    max="1000000"
                    min="-1000000"
                    onChange={(event) =>
                      setRandomMinimum(Number(event.target.value))
                    }
                    type="number"
                    value={randomMinimum}
                  />
                </label>
                <label>
                  <span>Máximo</span>
                  <input
                    max="1000000"
                    min="-1000000"
                    onChange={(event) =>
                      setRandomMaximum(Number(event.target.value))
                    }
                    type="number"
                    value={randomMaximum}
                  />
                </label>
              </div>

              <label className="decimal-toggle">
                <input
                  checked={useDecimals}
                  onChange={(event) => setUseDecimals(event.target.checked)}
                  type="checkbox"
                />
                <span>Permitir un decimal</span>
              </label>

              {generatorError && (
                <p className="generator-error" role="alert">
                  {generatorError}
                </p>
              )}

              <button
                className="generate-button"
                onClick={generateRandomData}
                type="button"
              >
                Generar ejemplo aleatorio
                <span aria-hidden="true">↻</span>
              </button>
            </div>

            {mode === "grouped" && (
              <div className="classes-control">
                <div>
                  <label htmlFor="classes">Número de intervalos</label>
                  <strong>{classCount}</strong>
                </div>
                <input
                  id="classes"
                  max="10"
                  min="3"
                  onChange={(event) => setClassCount(Number(event.target.value))}
                  type="range"
                  value={classCount}
                />
                <p>
                  Sugerencia de Sturges para estos datos:{" "}
                  <button
                    onClick={() => setClassCount(suggestedClasses)}
                    type="button"
                  >
                    usar {suggestedClasses}
                  </button>
                </p>
              </div>
            )}

            <div className="data-summary">
              <span>
                <small>Datos (n)</small>
                <strong>{result.total}</strong>
              </span>
              <span>
                <small>Mínimo</small>
                <strong>{formatNumber(result.minimum)}</strong>
              </span>
              <span>
                <small>Máximo</small>
                <strong>{formatNumber(result.maximum)}</strong>
              </span>
              <span>
                <small>Rango</small>
                <strong>{formatNumber(result.range)}</strong>
              </span>
            </div>

            {mode === "grouped" && result.width !== undefined && (
              <div className="calculation-note">
                <span aria-hidden="true">A</span>
                <p>
                  <strong>Amplitud usada:</strong> {formatNumber(result.width)}.
                  Los límites se ajustan para incluir todos los valores.
                </p>
              </div>
            )}
          </aside>

          <div className="results-panel">
            <div className="panel-heading">
              <div>
                <span className="step-number">2</span>
                <div>
                  <h3>Lee la distribución</h3>
                  <p>La tabla se actualiza mientras escribes</p>
                </div>
              </div>
              <span className="valid-badge">
                <i aria-hidden="true">✓</i> Tabla completa
              </span>
            </div>

            {result.rows.length ? (
              <>
                <div className="presentation-card">
                  <div>
                    <small>Variable a estudiar</small>
                    <strong>{variableName.trim() || "Sin especificar"}</strong>
                  </div>
                  <div>
                    <small>Cantidad de datos</small>
                    <strong>n = {result.total}</strong>
                  </div>
                  <span
                    className={
                      result.total >= 50
                        ? "requirement-badge complete"
                        : "requirement-badge pending"
                    }
                  >
                    {result.total >= 50
                      ? "✓ Cumple el mínimo de 50"
                      : `Faltan ${50 - result.total} datos`}
                  </span>
                </div>

                <details className="dataset-disclosure">
                  <summary>Ver los datos para la presentación</summary>
                  <p>{values.map((value) => formatNumber(value)).join(", ")}</p>
                </details>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{mode === "grouped" ? "Intervalo" : "xᵢ"}</th>
                        {mode === "grouped" && <th>Marca xᵢ</th>}
                        <th>
                          f<sub>i</sub>
                        </th>
                        <th>
                          F<sub>i</sub>
                        </th>
                        <th>
                          h<sub>i</sub>
                        </th>
                        <th>
                          H<sub>i</sub>
                        </th>
                        <th>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row) => (
                        <tr key={row.key}>
                          <th scope="row">{row.label}</th>
                          {mode === "grouped" && (
                            <td>{formatNumber(row.mark ?? 0)}</td>
                          )}
                          <td className="fi-cell">{row.fi}</td>
                          <td>{row.Fi}</td>
                          <td>{formatNumber(row.hi)}</td>
                          <td>{formatNumber(row.Hi)}</td>
                          <td>{formatNumber(row.hi * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th scope="row">Total</th>
                        {mode === "grouped" && <td>—</td>}
                        <td>{result.total}</td>
                        <td>—</td>
                        <td>1</td>
                        <td>—</td>
                        <td>100%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="chart-header">
                  <div>
                    <span className="step-number">3</span>
                    <div>
                      <h3>Visualiza el resultado</h3>
                      <p>
                        {metric === "fi"
                          ? "Frecuencia de cada valor o intervalo"
                          : "Porcentaje acumulado hasta cada fila"}
                      </p>
                    </div>
                  </div>
                  <div className="metric-switch" aria-label="Dato del gráfico">
                    <button
                      className={metric === "fi" ? "active" : ""}
                      onClick={() => setMetric("fi")}
                      type="button"
                    >
                      fᵢ
                    </button>
                    <button
                      className={metric === "Hi" ? "active" : ""}
                      onClick={() => setMetric("Hi")}
                      type="button"
                    >
                      Hᵢ
                    </button>
                  </div>
                </div>
                <DistributionChart metric={metric} rows={result.rows} />
              </>
            ) : (
              <div className="empty-state">
                <span aria-hidden="true">∑</span>
                <h3>Aquí aparecerá tu tabla</h3>
                <p>Escribe al menos un valor numérico para comenzar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
