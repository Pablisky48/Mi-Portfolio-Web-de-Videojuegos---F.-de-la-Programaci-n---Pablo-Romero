// Resalta en el menú la sección que se está viendo
const enlacesMenu = document.querySelectorAll('nav a');
const secciones = [...enlacesMenu]
  .map((enlace) => document.querySelector(enlace.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          enlacesMenu.forEach((enlace) => {
            enlace.classList.toggle('activo', enlace.getAttribute('href') === `#${entrada.target.id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  secciones.forEach((seccion) => observador.observe(seccion));
}

// Barra de progreso de lectura en la cabecera
const barraProgreso = document.querySelector('.progreso');

function actualizarProgreso() {
  if (!barraProgreso) return;
  const maximo = document.documentElement.scrollHeight - window.innerHeight;
  const avance = maximo > 0 ? window.scrollY / maximo : 0;
  barraProgreso.style.transform = `scaleX(${Math.min(Math.max(avance, 0), 1)})`;
}

window.addEventListener('scroll', actualizarProgreso, { passive: true });
window.addEventListener('resize', actualizarProgreso);
actualizarProgreso();
