// Filtrado de proyectos por categoría
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const tarjetas = document.querySelectorAll('.card');

botonesFiltro.forEach(boton => {
  boton.addEventListener('click', () => {
    // Cambiar botón activo
    botonesFiltro.forEach(btn => btn.classList.remove('activo'));
    boton.classList.add('activo');

    const categoria = boton.getAttribute('data-categoria');

    tarjetas.forEach(tarjeta => {
      if (categoria === 'todos' || tarjeta.getAttribute('data-categoria') === categoria) {
        tarjeta.style.display = 'flex';
      } else {
        tarjeta.style.display = 'none';
      }
    });
  });
});

// Lógica del Modal de detalles
const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modal-titulo');
const modalTexto = document.getElementById('modal-texto');
const cerrarModal = document.getElementById('cerrar-modal');

function mostrarDetalle(titulo, descripcion) {
  modalTitulo.textContent = titulo;
  modalTexto.textContent = descripcion;
  modal.classList.remove('oculto');
}

cerrarModal.addEventListener('click', () => {
  modal.classList.add('oculto');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('oculto');
  }
});
