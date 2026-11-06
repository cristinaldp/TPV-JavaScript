// app.js — TPV de la frutería · Sesión 1: catálogo y venta por código
// Los datos (crearProducto y el array productos) están en datos.js,
// que se carga antes que este fichero.

console.log(`Productos cargados: ${productos.length}`);
//.productos, .venta-codigo, .codigo, .aviso, .lineas, .total y .vaciar
const catalogo = document.querySelector(".productos");
const ventaCodigo = document.querySelector(".venta-codigo");
const codigo = document.querySelector(".codigo");
const aviso = document.querySelector(".aviso");
const listaLineas = document.querySelector(".lineas");
let lineas = [];   // cada línea: { producto: producto, cantidad: 1 }
class LineaTicket {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}
const total = document.querySelector(".total");
const vaciar = document.querySelector(".vaciar");

function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");
  tarjeta.dataset.id = producto.id;
  const nombre = document.createElement("h3");
  nombre.textContent = producto.nombre;
  const codigo = document.createElement("p");
  codigo.textContent = `Código ${producto.id}`;
  // ... precio y stock
  const precio = document.createElement("p");
  precio.textContent = producto.precio.toFixed(2) + " €/kg";
  const stock = document.createElement("p");
  stock.textContent = `Stock: ${producto.stock}`;
  tarjeta.append(nombre, codigo, precio, stock);
  return tarjeta;
}

function pintarCatalogo(){

    catalogo.replaceChildren();

    for (let producto of productos){
        let tarjeta = crearTarjetaProducto(producto);
        catalogo.append(tarjeta);
    }
}

pintarCatalogo();

function buscarProducto(id){
    for (let producto of productos){
        if (id === producto.id){
            return producto;
        }
    }
    return null;
}

function buscarLinea(id) {
    for (let linea of lineas) {
        if (id === linea.producto.id) {
            return linea;
        }
    }
    return null;
}

pintarTicket();

function pintarTicket(){
    vaciar.disabled = lineas.length === 0;
    listaLineas.replaceChildren();
    let totalPrecio = 0;
    for (let linea of lineas){
        const lineaTicket = document.createElement("li");

        lineaTicket.textContent = `${linea.producto.nombre} x ${linea.cantidad} · ${(linea.producto.precio * linea.cantidad).toFixed(2)} €`;
        listaLineas.append(lineaTicket);
        totalPrecio += linea.producto.precio * linea.cantidad;
    }

    total.textContent = `Total: ${totalPrecio.toFixed(2)} €`;
    console.log(`Ticket: ${lineas.length} línea(s), total ${totalPrecio.toFixed(2)} €`);
}

function anadirAlTicket(id) {
    const producto = buscarProducto(id);

    if (producto === null) {
        return `No existe el código ${id}`;
    }

    const linea = buscarLinea(id);

    if (linea !== null && linea.cantidad >= producto.stock + linea.cantidad) {
        return `${producto.nombre}: solo hay ${linea.cantidad}`;
    }

    if (producto.stock === 0) {
        return `${producto.nombre}: agotado`;
    }

    if (linea !== null) {
        linea.cantidad++;
    } else {
        lineas.push(new LineaTicket(producto, 1));
    }

    producto.stock--;

    return "";
}

function venderPorCodigo(event) {
    event.preventDefault();

    const id = Number(codigo.value);
    
    aviso.textContent = anadirAlTicket(id);

    
    pintarCatalogo();
    pintarTicket();
    codigo.value = "";
    codigo.focus();
}

ventaCodigo.addEventListener("submit", venderPorCodigo);

function vaciarTicket(){
    lineas = [];
    pintarTicket();
}

vaciar.addEventListener("click", vaciarTicket);