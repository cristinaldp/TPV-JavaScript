// datos.js
// Datos de partida del TPV de la frutería. Se carga ANTES que app.js,
// así que app.js puede usar crearProducto y productos.

function crearProducto(id, nombre, categoria, precio, unidad, stock) {
  return {
    id: id,
    nombre: nombre,
    categoria: categoria,   // "fruta", "verdura" o "frutos secos"
    precio: precio,         // euros por unidad de venta
    unidad: unidad,         // "kg" o "pieza"
    stock: stock,           // unidades (kg o piezas) disponibles
  };
}

const productos = [
  crearProducto(1, "Manzana golden", "fruta", 2.2, "kg", 20),
  crearProducto(2, "Plátano de Canarias", "fruta", 2.5, "kg", 15),
  crearProducto(3, "Naranja de zumo", "fruta", 1.6, "kg", 30),
  crearProducto(4, "Fresa", "fruta", 3.9, "kg", 4),
  crearProducto(5, "Piña", "fruta", 2.8, "pieza", 6),
  crearProducto(6, "Aguacate", "fruta", 1.2, "pieza", 0),
  crearProducto(7, "Tomate de rama", "verdura", 2.4, "kg", 18),
  crearProducto(8, "Lechuga romana", "verdura", 0.9, "pieza", 10),
  crearProducto(9, "Calabacín", "verdura", 1.8, "kg", 12),
  crearProducto(10, "Pimiento rojo", "verdura", 3.1, "kg", 2),
  crearProducto(11, "Nueces", "frutos secos", 9.5, "kg", 5),
  crearProducto(12, "Almendras", "frutos secos", 12.8, "kg", 3),
];
