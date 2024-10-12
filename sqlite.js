/**
 * Module handles database management
 *
 * The sample data is for a chat log with one table:
 * Messages: id + message text
 */

const fs = require("fs");
const dbFile = "./.data/basedatos.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

//SQLite wrapper for async / await connections https://www.npmjs.com/package/sqlite
dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database,
  })
  .then(async (dBase) => {
    db = dBase;

    try {
      if (!exists) {
        await db.run(
          "CREATE TABLE cuadros (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_cuadro TEXT, autor TEXT, descripcion TEXT, fecha_realizado DATE, link TEXT);"
        );
        await db.run(
          "CREATE TABLE mensajes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre_usuario TEXT NOT NULL, mensaje TEXT NOT NULL, fecha_mensaje TEXT DEFAULT (datetime('now')));"
        );

        await db.run(
          "INSERT INTO cuadros (nombre_cuadro, autor, descripcion, fecha_realizado,link) VALUES (?,?,?,?,?)",
          [
            "prueba",
            "lolo",
            "prueba",
            "2023-11-23",
            "https://ejemplo.com/imagen.jpg",
          ]
        );

        await db.run(
          "INSERT INTO mensajes (nombre_usuario, mensaje ) VALUES (?,?)",
          ["prueba", "mensaje"]
        );
      }
      console.log(await db.all("SELECT * from cuadros"));
      console.log(await db.all("SELECT * from mensajes"));
    } catch (dbError) {
      console.error(dbError);
    }
  });

// Server script calls these methods to connect to the db
module.exports = {
  // ver todos los cuadros
  getCuadros: async () => {
    try {
      return await db.all("SELECT * from cuadros");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  // Agregar un cuadro
  addCuadro: async (
    nombre_cuadro,
    autor,
    descripcion,
    fecha_realizado,
    link
  ) => {
    let success = false;
    try {
      success = await db.run(
        "INSERT INTO cuadros (nombre_cuadro, autor, descripcion, fecha_realizado,link) VALUES (?,?,?,?,?)",
        [nombre_cuadro, autor, descripcion, fecha_realizado, link]
      );
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  },

  // Update message text
  updateCuadro: async (id, message) => {
    let success = false;
    try {
      success = await db.run(
        "Update Messages SET message = ? WHERE id = ?",
        message,
        id
      );
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  },

  // Borrar un cuadro
  deleteCuadro: async (id) => {
    let success = false;
    try {
      success = await db.run("Delete from cuadros WHERE id = ?", id);
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  },

  //Obtener todos los mensajes
  getMensajes: async () => {
    try {
      return await db.all("SELECT * from mensajes");
    } catch (dbError) {
      console.error(dbError);
    }
  },

  addMensaje: async (nombre_usuario, mensaje) => {
    let success = false;
    try {
      success = await db.run(
        "INSERT INTO mensajes (nombre_usuario, mensaje ) VALUES (?,?)",
        [nombre_usuario, mensaje]
      );
    } catch (dbError) {
      console.error(dbError);
    }
    return success.changes > 0 ? true : false;
  },
};
