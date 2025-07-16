function agregarNota(btn) {
  const notasDiv = btn.parentNode.querySelector('.notas-lista');
  const nuevaNota = document.createElement('div');
  nuevaNota.innerHTML = `
    Nota: <input type="number" step="0.1" class="nota" placeholder="Nota" />
    %: <input type="number" class="peso" placeholder="%" />
  `;
  notasDiv.appendChild(nuevaNota);
  calcularPromedio(btn);
  notasDiv.querySelectorAll('input').forEach(i => i.addEventListener('input', () => calcularPromedio(btn)));
}

function calcularPromedio(btn) {
  const contenedor = btn.parentNode;
  const notas = contenedor.querySelectorAll('.nota');
  const pesos = contenedor.querySelectorAll('.peso');
  let total = 0, sumaPesos = 0;
  for (let i = 0; i < notas.length; i++) {
    const nota = parseFloat(notas[i].value);
    const peso = parseFloat(pesos[i].value);
    if (!isNaN(nota) && !isNaN(peso)) {
      total += nota * (peso / 100);
      sumaPesos += peso;
    }
  }
  const promedio = sumaPesos > 0 ? (total).toFixed(2) : 0;
  contenedor.querySelector('.promedio').textContent = promedio;
}

function agregarEvento(btn) {
  const parent = btn.parentNode;
  const fecha = parent.querySelector('input[type="date"]').value;
  const texto = parent.querySelector('input[type="text"]').value;
  const ul = parent.querySelector('.eventos');
  if (fecha && texto) {
    const li = document.createElement('li');
    li.textContent = `${fecha}: ${texto}`;
    ul.appendChild(li);
    parent.querySelector('input[type="text"]').value = '';
  }
}