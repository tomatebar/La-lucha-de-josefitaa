const ramos = {
  "1er Semestre": [
    { id: "intro_to", nombre: "Intro. a la T.O" },
    { id: "etica", nombre: "Ética en Salud" },
    { id: "quimica", nombre: "Integrado Químico Biológico" },
    { id: "comunicacion", nombre: "Habilidades de Comunicación" },
    { id: "trabajo_comunitario", nombre: "Intro. al Trabajo Comunitario" },
    { id: "ingles1", nombre: "Inglés I" },
    { id: "psico_comunicacion", nombre: "Psicología de la Comunicación" },
    { id: "practica1", nombre: "Práctica Curricular I", prerequisitos: ["admision"] }
  ],
  "2do Semestre": [
    { id: "fundamentos_to", nombre: "Fundamentos para la T.O", prerequisitos: ["intro_to"] },
    { id: "morfologia", nombre: "Integrado Morfología Humana" },
    { id: "socioantropologia", nombre: "Socioantropología" },
    { id: "ingles2", nombre: "Inglés II" },
    { id: "inclusion1", nombre: "Inclusión Social I" },
    { id: "transversal1", nombre: "Curso Transversal Inst. I" },
    { id: "electivo", nombre: "Electivo Formación General" },
    { id: "practica2", nombre: "Práctica Curricular II", prerequisitos: ["fundamentos_to", "practica1"] }
  ],
  "3er Semestre": [
    { id: "modelos1", nombre: "Modelos de Intervención I", prerequisitos: ["fundamentos_to"] },
    { id: "fisiologia", nombre: "Integrado de Fisiología Humana", prerequisitos: ["quimica"] },
    { id: "educacion_salud", nombre: "Educación en Salud", prerequisitos: ["trabajo_comunitario"] },
    { id: "locomotor", nombre: "Anatomía Funcional y Biomecánica", prerequisitos: ["morfologia"] },
    { id: "habilidades1", nombre: "Habilidades Terapéuticas I", prerequisitos: ["fundamentos_to"] },
    { id: "inclusion2", nombre: "Inclusión Social II", prerequisitos: ["inclusion1"] },
    { id: "curso_vida1", nombre: "Curso de Vida I", prerequisitos: ["admision"] },
    { id: "practica3", nombre: "Práctica Curricular III", prerequisitos: ["fundamentos_to", "practica2"] }
  ]
  // Puedes continuar agregando los demás semestres aquí como en versiones anteriores
};

const aprobados = new Set();
const notas = {};

const storedAprobados = localStorage.getItem("aprobados");
if (storedAprobados) {
  JSON.parse(storedAprobados).forEach(id => aprobados.add(id));
}

const storedNotas = localStorage.getItem("notas");
if (storedNotas) {
  Object.assign(notas, JSON.parse(storedNotas));
}

function guardarDatos() {
  localStorage.setItem("aprobados", JSON.stringify(Array.from(aprobados)));
  localStorage.setItem("notas", JSON.stringify(notas));
}

function calcularPromedio(id) {
  const notasRamo = notas[id] || [0, 0, 0, 0];
  return (
    notasRamo[0] * 0.2 +
    notasRamo[1] * 0.25 +
    notasRamo[2] * 0.3 +
    notasRamo[3] * 0.25
  ).toFixed(1);
}

function renderMalla() {
  const container = document.getElementById("contenedor-malla");
  container.innerHTML = "";

  for (let semestre in ramos) {
    const div = document.createElement("div");
    div.className = "semestre";
    const title = document.createElement("h2");
    title.textContent = semestre;
    div.appendChild(title);

    ramos[semestre].forEach(ramo => {
      const r = document.createElement("div");
      r.className = "ramo";
      const bloqueado = ramo.prerequisitos && !ramo.prerequisitos.every(p => aprobados.has(p));
      const aprobado = aprobados.has(ramo.id);

      if (aprobado) r.classList.add("aprobado");
      else if (bloqueado) r.classList.add("bloqueado");

      const nombre = document.createElement("span");
      nombre.textContent = ramo.nombre;

      const promedio = document.createElement("span");
      promedio.className = "promedio";
      promedio.textContent = `🩷 Prom: ${calcularPromedio(ramo.id)}`;

      r.appendChild(nombre);
      r.appendChild(promedio);

      if (!bloqueado) {
        r.onclick = () => {
          if (aprobados.has(ramo.id)) aprobados.delete(ramo.id);
          else aprobados.add(ramo.id);
          guardarDatos();
          renderMalla();
        };
      }

      const divNotas = document.createElement("div");
      divNotas.className = "notas";
      divNotas.innerHTML = "Notas: ";
      notas[ramo.id] = notas[ramo.id] || [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.max = 7;
        input.step = 0.1;
        input.value = notas[ramo.id][i];
        input.oninput = () => {
          notas[ramo.id][i] = parseFloat(input.value) || 0;
          promedio.textContent = `🩷 Prom: ${calcularPromedio(ramo.id)}`;
          guardarDatos();
        };
        divNotas.appendChild(input);
      }
      r.appendChild(divNotas);
      div.appendChild(r);
    });

    container.appendChild(div);
  }
}

renderMalla();
