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

// Consola interactiva: empieza apagada (OFF) y se desbloquea con un código
const CODIGO_ACCESO = 'facu';

const interruptor = document.getElementById('interruptor');
const interruptorTexto = document.getElementById('interruptor-texto');
const consolaEstatica = document.getElementById('consola-estatica');
const consolaActiva = document.getElementById('consola-activa');
const consolaSalida = document.getElementById('consola-salida');
const consolaForm = document.getElementById('consola-form');
const consolaEntrada = document.getElementById('consola-entrada');
const consolaPrompt = document.getElementById('consola-prompt');

if (interruptor && consolaActiva) {
  let encendida = false;
  let desbloqueada = false;

  function escribir(texto, clase = '') {
    const linea = document.createElement('div');
    linea.className = `linea ${clase}`.trim();
    linea.textContent = texto;
    consolaSalida.appendChild(linea);
    consolaSalida.scrollTop = consolaSalida.scrollHeight;
  }

  function mostrarEstado() {
    interruptor.setAttribute('aria-checked', String(encendida));
    interruptorTexto.textContent = encendida ? 'ON' : 'OFF';
    consolaEstatica.hidden = encendida;
    consolaActiva.hidden = !encendida;
  }

  function encender() {
    encendida = true;
    mostrarEstado();
    if (!consolaSalida.children.length) {
      if (desbloqueada) {
        escribir('Consola lista. Escribí "ayuda" para ver los comandos.', 'ok');
      } else {
        escribir('Consola protegida. Ingresá el código de acceso.', 'sistema');
      }
    }
    consolaPrompt.textContent = desbloqueada ? '>' : 'código>';
    consolaEntrada.focus();
  }

  function apagar() {
    encendida = false;
    mostrarEstado();
  }

  function irA(id) {
    const destino = document.getElementById(id);
    if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const comandos = {
    ayuda() {
      escribir('Comandos disponibles:', 'sistema');
      escribir('  trabajos   lista los trabajos prácticos');
      escribir('  sobre      quién soy');
      escribir('  scratch    ir al TP1');
      escribir('  rpg        ir al TP2');
      escribir('  godot      ir al TP3');
      escribir('  hola       un saludo');
      escribir('  limpiar    borra la pantalla');
      escribir('  salir      apaga la consola');
    },
    trabajos() {
      escribir('TP1  Scratch');
      escribir('TP2  RPG Maker MV');
      escribir('TP3  Godot');
    },
    sobre() {
      escribir('Pablo Romero, estudiante de Producción y Desarrollo de Videojuegos en la UNPAZ.');
    },
    scratch() {
      escribir('Yendo al TP1...', 'sistema');
      irA('tp1');
    },
    rpg() {
      escribir('Yendo al TP2...', 'sistema');
      irA('tp2');
    },
    godot() {
      escribir('Yendo al TP3...', 'sistema');
      irA('tp3');
    },
    hola() {
      escribir('¡Hola! Gracias por visitar mi portfolio.', 'ok');
    },
    suarez() {
      escribir('Profe Suárez:', 'ok');
      escribir('Gracias por enseñarme a pensar como programador.', 'ok');
      escribir('Este portfolio es mi primer paso para hacer videojuegos.', 'ok');
      escribir('¡Gracias por todo! Pablo Romero', 'ok');
    },
    limpiar() {
      consolaSalida.textContent = '';
    },
    salir() {
      escribir('Apagando consola...', 'sistema');
      apagar();
      interruptor.focus();
    }
  };
  comandos.clear = comandos.limpiar;
  comandos.exit = comandos.salir;

  interruptor.addEventListener('click', () => {
    if (encendida) {
      apagar();
    } else {
      encender();
    }
  });

  consolaForm.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const valor = consolaEntrada.value.trim();
    consolaEntrada.value = '';
    if (!valor) return;

    if (!desbloqueada) {
      escribir(`código> ${'*'.repeat(valor.length)}`, 'eco');
      if (valor.toLowerCase() === CODIGO_ACCESO) {
        desbloqueada = true;
        consolaPrompt.textContent = '>';
        escribir('Acceso concedido. Escribí "ayuda" para ver los comandos.', 'ok');
      } else {
        escribir('Código incorrecto. Probá de nuevo.', 'error');
      }
      return;
    }

    escribir(`> ${valor}`, 'eco');
    // Normaliza mayúsculas y tildes para reconocer, por ejemplo, "Suárez"
    const clave = valor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const accion = comandos[clave];
    if (accion) {
      accion();
    } else {
      escribir(`Comando no reconocido: ${valor}. Escribí "ayuda".`, 'error');
    }
  });

  consolaEntrada.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      apagar();
      interruptor.focus();
    }
  });

  mostrarEstado();
}
