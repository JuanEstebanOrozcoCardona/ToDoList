// Funciones de validación de usuario
function validarCorreo(correo) {
    return /\S+@\S+\.\S+/.test(correo);
}

function validarPassword(password) {
    const errores = [];
    if (password.length < 6) errores.push("Mínimo 6 caracteres.");
    if (!/[A-Z]/.test(password)) errores.push("Una letra mayúscula.");
    if (!/[0-9]/.test(password)) errores.push("Un número.");
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) errores.push("Un símbolo.");
    return errores;
}

// Registro de usuario
function registrarse() {
    const correo = document.getElementById('registroCorreo').value.trim();
    const password = document.getElementById('registroPassword').value.trim();
    const error = document.getElementById('registroError');

    error.innerHTML = "";

    if (!correo || !password) {
        error.innerHTML = "❌ Completa todos los campos.";
        return;
    }

    if (!validarCorreo(correo)) {
        error.innerHTML = "❌ El correo es inválido.";
        return;
    }

    const erroresPassword = validarPassword(password);
    if (erroresPassword.length > 0) {
        error.innerHTML = "❌ Contraseña no válida:<br>• " + erroresPassword.join("<br>• ");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
    if (usuarios[correo]) {
        error.innerHTML = "❌ El correo ya está registrado.";
        return;
    }

    usuarios[correo] = password;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    window.location.href = 'index.html';
}

// Inicio de sesión
function iniciarSesion() {
    const correo = document.getElementById('loginCorreo').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const error = document.getElementById('loginError');

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

    if (!correo || !password) {
        error.textContent = "❌ Completa todos los campos.";
        return;
    }

    if (!usuarios[correo]) {
        error.textContent = "❌ El correo no está registrado.";
        return;
    }

    if (usuarios[correo] !== password) {
        error.textContent = "❌ Contraseña incorrecta.";
        return;
    }

    localStorage.setItem('usuarioActivo', correo);
    window.location.href = 'iniciotodolist.html';
}

// Cargar tareas
function cargarTareas() {
    const usuario = localStorage.getItem('usuarioActivo');
    const tareas = JSON.parse(localStorage.getItem(`tareas_${usuario}`)) || [];

    const lista = document.getElementById("listaTareas");
    const usuarioTexto = document.getElementById("usuarioActivo");

    const contador = document.getElementById("contadorTareas");

    if (usuarioTexto) usuarioTexto.textContent = "Usuario: " + usuario;

    if (!lista) return;

    lista.innerHTML = "";
    let tareasCompletadas = 0;
    let tareasPendientes = 0;

    tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        li.textContent = tarea.texto;
        if (tarea.completada) {
            li.style.textDecoration = "line-through"; // Tachamos las tareas completadas
        }

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "❌";
        btnEliminar.onclick = () => eliminarTarea(index);

        const btnCompletar = document.createElement("button");
        btnCompletar.textContent = tarea.completada ? "Pendiente" : "✔️";
        btnCompletar.onclick = () => cambiarEstadoTarea(index);

        li.appendChild(btnCompletar);
        li.appendChild(btnEliminar);
        lista.appendChild(li);

        // Contar las tareas completadas y pendientes
        if (tarea.completada) {
            tareasCompletadas++;
        } else {
            tareasPendientes++;
        }
    });

    // Mostrar el contador de tareas
    if (contador) {
        contador.textContent = `Tareas: ${tareas.length} | Completadas: ${tareasCompletadas} | Pendientes: ${tareasPendientes}`;
    }
}

// Agregar tarea
function agregarTarea() {
    const usuario = localStorage.getItem('usuarioActivo');
    const input = document.getElementById("nuevaTarea");
    const tarea = input.value.trim();

    if (!tarea) return;

    const tareas = JSON.parse(localStorage.getItem(`tareas_${usuario}`)) || [];
    tareas.push({ texto: tarea, completada: false });
    localStorage.setItem(`tareas_${usuario}`, JSON.stringify(tareas));
    input.value = "";
    cargarTareas();
}

// Eliminar tarea
function eliminarTarea(index) {
    const usuario = localStorage.getItem('usuarioActivo');
    const tareas = JSON.parse(localStorage.getItem(`tareas_${usuario}`)) || [];
    tareas.splice(index, 1);
    localStorage.setItem(`tareas_${usuario}`, JSON.stringify(tareas));
    cargarTareas();
}

// Cambiar estado de la tarea (completar o pendiente)
function cambiarEstadoTarea(index) {
    const usuario = localStorage.getItem('usuarioActivo');
    const tareas = JSON.parse(localStorage.getItem(`tareas_${usuario}`)) || [];

    tareas[index].completada = !tareas[index].completada; // Cambiar el estado
    localStorage.setItem(`tareas_${usuario}`, JSON.stringify(tareas));
    cargarTareas();
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
}

// Verificación de sesión en el To-Do List
document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    // Proteger el acceso al To-Do List
    if (window.location.pathname.includes("iniciotodolist.html") && !usuarioActivo) {
        window.location.href = "index.html"; // redirigir al login
        return;
    }

    if (document.getElementById("listaTareas")) {
        cargarTareas();
    }
});

// Personalización de estilo
const modal = document.getElementById("settings-modal");
const openBtn = document.getElementById("open-settings");
const closeBtn = document.getElementById("close-settings");
const resetBtn = document.getElementById("reset-settings");

const bgColorPicker = document.getElementById("bg-color-picker");
const fontSelector = document.getElementById("font-selector");
const fontSizeSlider = document.getElementById("font-size-slider");

if (openBtn) openBtn.onclick = () => modal.classList.remove("hidden");
if (closeBtn) closeBtn.onclick = () => modal.classList.add("hidden");

// Aplicar cambios de estilo
if (bgColorPicker) {
    bgColorPicker.oninput = (e) => {
        document.body.style.backgroundColor = e.target.value;
    };
}

if (fontSelector) {
    fontSelector.onchange = (e) => {
        document.body.style.fontFamily = e.target.value;
    };
}

if (fontSizeSlider) {
    fontSizeSlider.oninput = (e) => {
        document.body.style.fontSize = e.target.value + "px";
    };
}

// Reset
if (resetBtn) {
    resetBtn.onclick = () => {
        document.body.style.backgroundColor = "#f4f4f4";
        document.body.style.fontFamily = "Arial";
        document.body.style.fontSize = "16px";

        bgColorPicker.value = "#f4f4f4";
        fontSelector.value = "Arial";
        fontSizeSlider.value = 16;
    };
};
