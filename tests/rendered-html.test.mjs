import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Frecuencia Lab and its learning tools", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Frecuencia Lab \| Tablas de frecuencia fáciles<\/title>/i);
  assert.match(html, /Construye tu tabla/);
  assert.match(html, /Variable a estudiar/);
  assert.match(html, /Generador de práctica/);
  assert.match(html, /Modo presentación/);
  assert.match(html, /Cumple el mínimo de 50|Faltan \d+ datos/);
  assert.match(html, /Datos no agrupados/);
  assert.match(html, /Datos agrupados/);
  assert.match(html, /Proverbios 1:5/);
});

test("keeps random generation bounded and presentation-ready", async () => {
  const workbench = await readFile(
    new URL("../app/components/FrequencyWorkbench.tsx", import.meta.url),
    "utf8",
  );

  assert.match(workbench, /normalizedCount < 5/);
  assert.match(workbench, /normalizedCount > 200/);
  assert.match(workbench, /randomMinimum >= randomMaximum/);
  assert.match(workbench, /Math\.random\(\)/);
  assert.match(workbench, /variableName\.trim\(\)/);
  assert.match(workbench, /values\.map\(\(value\) => formatNumber\(value\)\)/);
  assert.match(workbench, /result\.total >= 50/);
});
