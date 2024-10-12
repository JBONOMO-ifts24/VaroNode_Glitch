document.addEventListener("DOMContentLoaded", (event) => {
  mostrarDatos();
  console.log("Hola 🌎 !!!");
});

function subirMensaje() {
  const nombre_usuario = document.getElementById("nombre_usuario");
  const mensaje = document.getElementById("mensaje");
  const avi = document.getElementById("avisos");

  let nombre = nombre_usuario.value.trim(); //Se sacan los espacios en blanco adelante y atrás del string
  let men = mensaje.value.trim();

  //Validación de los datos en los campos nombre y mensaje
  if (nombre.length < 3 || men.length < 3) {
    const p = document.createElement("div");
    let mensaje_e =
      '<div class="alert alert-danger" role="alert">Los datos ingresados no son correctos 😰</div>';

    p.innerHTML = mensaje_e;
    avi.appendChild(p);
    nombre_usuario.value = "";
    mensaje.value = "";

    setTimeout(() => {
      avi.innerHTML = "";
    }, 4000);
  } else {
    fetch("/mensajes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre_usuario: nombre,
        mensaje: men,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        nombre_usuario.value = "";
        mensaje.value = "";

        alert("😄 Mensaje enviado con éxito! 😄");
      })
      .catch((error) => console.error("Error:", error));
    avi.innerHTML = "";
    mostrarDatos();
  }
}

function mostrarDatos() {
  fetch("/mensajes")
    .then((response) => response.json())
    .then((data) => {
      const mensajesContainer = document.getElementById("datosGuardados");
      if (data && Array.isArray(data)) {
        data.forEach((mensaje) => {
          const p = document.createElement("div");
          p.innerHTML =
            "<p>El día " +
            mensaje.fecha_mensaje +
            "<strong> " +
            mensaje.nombre_usuario +
            "</strong> escribió: <strong>" +
            mensaje.mensaje +
            " </strong> <button class='btn btn-primary' onclick= editar(" +
            mensaje.id +
            ")>✏️</button> <button class='btn btn-primary' onclick= borrar(" +
            mensaje.id +
            ")>❌</button></p>";
          mensajesContainer.appendChild(p);
        });
      } else {
        mensajesContainer.innerHTML = "<p>No hay mensajes 😞 </p>";
      }
    })
    .catch((error) => console.error("Error:", error));
}
