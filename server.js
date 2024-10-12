// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
const db = require("./sqlite.js");
// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: false }));
// Middleware para parsear datos JSON
app.use(express.json());

const errorMessage =
  "Whoops! Error conectandose a la BBDD, por favor probar de nuevo!";

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/historia", function (request, response) {
  response.sendFile(__dirname + "/views/historia.html");
});

//Ruta para la página del formulario de opiniones
app.get("/opiniones", function (request, response) {
  response.sendFile(__dirname + "/views/opiniones.html");
});

//Rutas para la API de cuadros
app.get("/cuadros", async (request, reply) => {
  let data = {};
  data = await db.getCuadros();
  console.log(data);
  if (!data) data.error = errorMessage;
  const status = data.error ? 400 : 200;
  reply.status(status).send(data);
});

app.post("/cuadros", async (request, reply) => {
  console.log(request.body);
  let data = {};
  const auth = authorized(request.headers.admin_key);
  if (!auth || !request.body) data.success = false;
  else if (auth)
    data.success = await db.addCuadro(
      request.body.nombre_cuadro,
      request.body.autor,
      request.body.descripcion,
      request.body.fecha_realizado,
      request.body.link
    );
  const status = data.success ? 201 : auth ? 400 : 401;
  reply.status(status).send(data);
});

// Update (auth)
app.put("/cuadros", async (request, reply) => {
  let data = {};
  const auth = authorized(request.headers.admin_key);
  if (!auth || !request.body || !request.body.id || !request.body.message)
    data.success = false;
  else
    data.success = await db.updateCuadro(request.body.id, request.body.message);
  const status = data.success ? 201 : auth ? 400 : 401;
  reply.status(status).send(data);
});

// Delete (auth)
app.delete("/cuadros", async (request, reply) => {
  let data = {};
  console.log(request.query.id);
  const auth = authorized(request.headers.admin_key);
  if (!auth || !request.query || !request.query.id) data.success = false;
  else data.success = await db.deleteCuadro(request.query.id);
  const status = data.success ? 201 : auth ? 400 : 401;
  reply.status(status).send(data);
});

// Helper function to authenticate the user key
const authorized = (key) => {
  if (
    !key ||
    key < 1 ||
    !process.env.ADMIN_KEY ||
    key !== process.env.ADMIN_KEY
  )
    return false;
  else return true;
};

//API mensajes
app.get("/mensajes", async (request, reply) => {
  let data = {};
  data = await db.getMensajes();
  console.log(data);
  if (!data) data.error = errorMessage;
  const status = data.error ? 400 : 200;
  reply.status(status).send(data);
});

//En el posteo de los mensajes no es necesario estar logueado, por eso no se consultan credenciales.
app.post("/mensajes", async (request, reply) => {
  let data = {};
  console.log(request.body);
  if (!request.body) data.success = false;
  else
    data.success = await db.addMensaje(
      request.body.nombre_usuario,
      request.body.mensaje
    );
  const status = data.success ? 200 : 400;
  reply.status(status).send(data);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
