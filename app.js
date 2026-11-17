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
const detalle = document.querySelector(".detalle");
const pagina = document.querySelector("body");
const contenedorFiltros = document.querySelector(".filtros");
const botonesFiltro = contenedorFiltros.querySelectorAll("button");
const ventas = [];
const btnCobrar = document.querySelector(".cobrar");
const resumenVentas = document.querySelector(".resumen-ventas");
let ultimoId = null;
let categoriaActual = "todas";
let siguienteTicket = 1;

function cumpleFiltro(producto){
    if(producto.categoria === categoriaActual){
        return true;
    } else if (categoriaActual === "todas"){
        return true;
    } else{
        return false;
    }
}

function cobrar(){

    const total = totalTicket();

    ventas.push({ numero: siguienteTicket, total: total, lineas: lineas.length });
    console.log(`Cobrado ticket ${siguienteTicket}: ${total.toFixed(2)} €`);
    siguienteTicket++;

    resumenVentas.textContent = `Tickets: ${ventas.length} · Recaudado: ${recaudacion().toFixed(2)} € · Ticket medio: ${media().toFixed(2)} €`;

    lineas = [];
    ultimoId = null;
    pintarCatalogo();
    pintarTicket();
}

function recaudacion(){
    let total = 0;
    for(let venta of ventas){
        total += venta.total;
    }

    return total;
}

function media(){

    let suma = 0;
    for(let venta of ventas){
        suma += venta.total;
    }

    return suma/ventas.length;
}

btnCobrar.addEventListener("click", cobrar);

function totalTicket(){
    let totalPrecio = 0;
    for (let linea of lineas){

        totalPrecio += linea.producto.precio * linea.cantidad;
    }

    return totalPrecio;
}

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
  const contenedor = document.createElement("div");
  contenedor.classList.add("botones");
  const boton = document.createElement("button");
  boton.classList.add("anadir");
  boton.textContent="Añadir";
  contenedor.append(boton);
  tarjeta.append(contenedor);

  tarjeta.classList.toggle("pocas", producto.stock > 0 && producto.stock <= 3);

  tarjeta.classList.toggle("agotado", producto.stock === 0);
  boton.disabled = producto.stock === 0;

  return tarjeta;
}

function pintarCatalogo(){

    catalogo.replaceChildren();

    for (let producto of productos){
        if(!cumpleFiltro(producto)) continue;

        let tarjeta = crearTarjetaProducto(producto);
        catalogo.append(tarjeta);
    }

    for (const boton of botonesFiltro) {

        boton.classList.toggle("activo", boton.dataset.categoria === categoriaActual);
    }
}

contenedorFiltros.addEventListener("click", (event)=>{
    const boton = event.target.closest("button");

    if(boton === null) return;

    categoriaActual = boton.dataset.categoria;

    console.log(`Filtro: ${boton.dataset.categoria}`);
    pintarCatalogo();
});

pintarCatalogo();

catalogo.addEventListener("click", (event)=>{
     const tarjetaElegida = event.target.closest(".tarjeta");
     const botonAnadir = event.target.closest(".anadir");

     if (tarjetaElegida === null || botonAnadir !== null){
        return;
     }

     const id = Number(tarjetaElegida.dataset.id);
     const producto = buscarProducto(id);

     detalle.textContent = `${producto.nombre} · ${producto.categoria} · ${producto.precio.toFixed(2)} €/pieza · Quedan ${producto.stock}`;
     console.log(`${producto.nombre} · ${producto.categoria} · ${producto.precio.toFixed(2)} €/pieza · Quedan ${producto.stock}`);
});

pagina.addEventListener("keydown", (event)=>{

    if(event.key === "Escape"){
        codigo.value = "";
        aviso.textContent = "";
        console.log("Escape: código y aviso borrados");
    }

})

catalogo.addEventListener("click", (event)=>{

    const tarjetaElegida = event.target.closest(".tarjeta");

    if (tarjetaElegida === null) return; // clic en un hueco

    const id = Number(tarjetaElegida.dataset.id);// dataset devuelve texto

    if (event.target.closest(".anadir") !== null) {
        // anadirAlTicket(id), escribir el aviso y pintarTicket()
        aviso.textContent = anadirAlTicket(id);
        pintarCatalogo();
        pintarTicket();
    }
  });

function crearLineaTicket(linea){

    const elemento = document.createElement("li");
    elemento.dataset.id = linea.producto.id;

    elemento.classList.toggle("reciente", ultimoId === linea.producto.id);

    const texto = document.createElement("span");
    texto.textContent = `${linea.producto.nombre} x ${linea.cantidad} · ${(linea.producto.precio * linea.cantidad).toFixed(2)} €`;

    const botones = document.createElement("span");
    const mas = document.createElement("button");
    mas.textContent = "+";
    mas.dataset.accion = "mas";
    const menos = document.createElement("button");
    menos.textContent = "-";
    menos.dataset.accion = "menos";
    const quitar = document.createElement("button");
    quitar.textContent = "quitar";
    quitar.dataset.accion = "quitar";
    botones.append(mas, menos, quitar);

    elemento.append(texto, botones);
    return elemento;
}

function quitarLinea(id){
    for(let i = 0; i<lineas.length; i++){
        if(lineas[i].producto.id === id){
            lineas[i].producto.stock = lineas[i].producto.stock + lineas[i].cantidad;
            lineas.splice(i,1);
            return;
        }
    }
}

listaLineas.addEventListener("click", (event)=>{
    const botonElegido = event.target.closest("button");

    if (botonElegido === null) return;

    const id = Number(botonElegido.closest("li").dataset.id);
    const linea = buscarLinea(id);

    if(botonElegido.dataset.accion === "mas"){

        if (linea.producto.stock > 0){
            linea.cantidad++;
            linea.producto.stock--;
            ultimoId = linea.producto.id;
        } else {
            aviso.textContent = `${linea.producto.nombre}: solo hay ${linea.cantidad}`;
        }
        
    } else if (botonElegido.dataset.accion === "menos"){

        aviso.textContent = "";

        if (linea.cantidad > 1){
            linea.cantidad--;
            linea.producto.stock++;
            ultimoId = linea.producto.id;
        } else if(linea.cantidad === 1){
            quitarLinea(id);
        }
        
    } else{
        quitarLinea(id);
        aviso.textContent = "";
    }

    pintarCatalogo();
    pintarTicket();

});

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
    btnCobrar.disabled = lineas.length === 0;

    listaLineas.replaceChildren();

    for (let linea of lineas){
        const lineaTicket = crearLineaTicket(linea);

        listaLineas.append(lineaTicket);
    }

    total.textContent = `Total: ${totalTicket().toFixed(2)} €`;
    console.log(`Ticket: ${lineas.length} línea(s), total ${totalTicket().toFixed(2)} €`);
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
        ultimoId = id;
    } else {
        lineas.push(new LineaTicket(producto, 1));
        ultimoId = id;
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

    for (const linea of lineas) {
        linea.producto.stock += linea.cantidad;
    }
    
    lineas = [];
    aviso.textContent = "";

    pintarCatalogo();
    pintarTicket();
}

vaciar.addEventListener("click", vaciarTicket);