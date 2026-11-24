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
const campo = document.querySelector(".buscar");
const body = document.querySelector("body");
const formularioAlta = document.querySelector(".alta");
const campoNombre = formularioAlta.querySelector(".alta-nombre");
const campoCategoria = formularioAlta.querySelector(".alta-categoria");
const campoPrecio = formularioAlta.querySelector(".alta-precio");
const campoStock = formularioAlta.querySelector(".alta-stock");
const campoUnidad = formularioAlta.querySelectorAll("input[name='unidad']");
const casillaOferta = formularioAlta.querySelector(".alta-oferta");
const contadorSpan = document.querySelector(".contador-nombre");
const tituloGestion = document.querySelector(".titulo-gestion");
const botonGuardar = document.querySelector(".guardar");
const botonCancelar = document.querySelector(".cancelar");
botonCancelar.hidden = true;
let contadorNombre = 0;
let ultimoId = null;
let idEditando = null;
let categoriaActual = "todas";
let siguienteTicket = 1;
let tam = 16;
let siguienteId = 1; //En cada carga igualo siguienteId al número más alto disponible
for (const producto of productos) {
  if (producto.id >= siguienteId) siguienteId = producto.id + 1;
}

function cumpleFiltro(producto){

    const coincideCategoria = categoriaActual === "todas" || producto.categoria === categoriaActual;

    const coincideNombre = producto.nombre.toLowerCase().includes(campo.value.trim().toLowerCase());

    if(coincideCategoria && coincideNombre){
        return true;
    }

    return false;
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
  
  if(producto.oferta === true){
    const oferta = document.createElement("span");
    oferta.classList.add("etiqueta-oferta");
    oferta.textContent = "OFERTA";
    nombre.append(oferta);
  }

  const codigo = document.createElement("p");
  codigo.textContent = `Código ${producto.id}`;
  // ... precio y stock
  const precio = document.createElement("p");
  precio.textContent = producto.precio.toFixed(2) + " €/" + producto.unidad;
  const stock = document.createElement("p");

  let disponible = producto.stock - cantidadEnTicket(producto.id);
  stock.textContent = `Quedan ${disponible}`;
  tarjeta.append(nombre, codigo, precio, stock);

  const contenedor = document.createElement("div");
  contenedor.classList.add("botones");
  const boton = document.createElement("button");
  boton.classList.add("anadir");
  boton.textContent="Añadir";
  contenedor.append(boton);
  const borrar = document.createElement("button");
  borrar.classList.add("borrar");
  borrar.textContent = "Borrar";
  contenedor.append(borrar);
  const editar = document.createElement("button");
  editar.classList.add("editar");
  editar.textContent = "Editar";
  contenedor.append(editar);

  tarjeta.append(contenedor);

  tarjeta.classList.toggle("pocas", disponible > 0 && disponible <= 3);

  tarjeta.classList.toggle("agotado", disponible === 0);
  boton.disabled = disponible === 0;

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

catalogo.addEventListener("click", (event)=>{
     const tarjetaElegida = event.target.closest(".tarjeta");
     const botonAnadir = event.target.closest(".anadir");
     const botonBorrar = event.target.closest(".borrar");
     const botonEditar = event.target.closest(".editar");
    
     if (tarjetaElegida === null || botonAnadir !== null || botonBorrar !== null || botonEditar !== null){
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
    const producto = buscarProducto(id);
    const linea = buscarLinea(id);

    if (event.target.closest(".anadir") !== null) {
        // anadirAlTicket(id), escribir el aviso y pintarTicket()
        aviso.textContent = anadirAlTicket(id);
        pintar();
    }

    if (event.target.closest(".borrar") !== null) {
        if (id === idEditando) {
            aviso.textContent = `${producto.nombre} se está editando: no se puede borrar`;
            return;
        }
        
        if(linea === null){
            console.log(`Borrado: ${producto.nombre}`);
            productos.splice(productos.indexOf(producto), 1);
            pintar();
        } else{
            aviso.textContent = `${producto.nombre} está en el ticket: no se puede borrar`;
        }
    }

    if(event.target.closest(".editar") !== null){

        idEditando = id;
        tituloGestion.textContent = `Editar: ${producto.nombre}`;
        botonGuardar.textContent = "Guardar cambios";
        botonCancelar.hidden = false;
        campoNombre.value = producto.nombre;
        contadorSpan.textContent = `${campoNombre.value.length} / 30`;
        campoCategoria.value = producto.categoria;
        campoPrecio.value = producto.precio;
        for(let campo of campoUnidad){
            campo.checked = campo.value === producto.unidad;
        }
        //formularioAlta.querySelector(`input[name='unidad'][value='${producto.unidad}']`).checked = true;
        campoStock.value = producto.stock;
        casillaOferta.checked = producto.oferta === true;

        console.log(`Editando ${producto.nombre}(código ${producto.id})`);
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

        if (linea.producto.stock - linea.cantidad > 0){
            linea.cantidad++;
            ultimoId = linea.producto.id;
        } else {
            aviso.textContent = `${linea.producto.nombre}: solo hay ${linea.cantidad}`;
        }
        
    } else if (botonElegido.dataset.accion === "menos"){

        aviso.textContent = "";

        if (linea.cantidad > 1){
            linea.cantidad--;
            ultimoId = linea.producto.id;
        } else if(linea.cantidad === 1){
            quitarLinea(id);
        }
        
    } else{
        quitarLinea(id);
        aviso.textContent = "";
    }

    pintar();

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

    return "";
}

function venderPorCodigo(event) {
    event.preventDefault();

    const id = Number(codigo.value);
    
    aviso.textContent = anadirAlTicket(id);

    
    pintar();
    codigo.value = "";
    codigo.focus();
}

ventaCodigo.addEventListener("submit", venderPorCodigo);

function vaciarTicket(){
    
    lineas = [];
    aviso.textContent = "";
    ultimoId = null;
    pintar();
}

vaciar.addEventListener("click", vaciarTicket);

campo.addEventListener("input", (event)=>{
    pintarCatalogo();
});

function cantidadEnTicket(id){
    const linea = buscarLinea(id);
    if(linea !== null){
        return linea.cantidad;
    }
    return 0;
}

function pintar() {
  pintarCatalogo();
  pintarTicket();
}

body.addEventListener("click", (event)=>{
    const tema = event.target.closest(".tema");
    const tamMenos = event.target.closest(".letra-menos");
    const tamMas = event.target.closest(".letra-mas");

    if(tema === null && tamMas === null && tamMenos === null){
        return;
    }

    if(tema !== null){
        body.classList.toggle("oscuro");
        let oscuro = body.classList.contains("oscuro");

        if(oscuro){
            tema.textContent = "Tema claro";
            console.log("Tema oscuro: true");
        } else{
            tema.textContent = "Tema oscuro";
            console.log("Tema oscuro: false");
        }
    }

    if(tamMas !== null){
        if (tam < 24){
            tam +=2;
            body.style.setProperty("--tam-ticket", `${tam}px`);
            console.log(`--tam-ticket: ${tam}px`);
        } else{
            return;
        }  
    }

    if(tamMenos !== null){
        if (tam > 12){
            tam -=2;
            body.style.setProperty("--tam-ticket", `${tam}px`);
            console.log(`--tam-ticket: ${tam}px`)
        } else{
            return;
        }  
    }

});

botonCancelar.addEventListener("click", (event)=>{
    idEditando = null;

    tituloGestion.textContent = "Alta de producto";
    botonGuardar.textContent = "Dar de alta";
    botonCancelar.hidden = true;

    formularioAlta.reset();
    contadorSpan.textContent = "0 / 30";

    campoNombre.setCustomValidity("");

    mostrarError(campoNombre, errorNombre, "");
    mostrarError(campoCategoria, errorCategoria, "");
    mostrarError(campoPrecio, errorPrecio, "");
    mostrarError(campoStock, errorStock, "");

    campoNombre.focus();

    console.log("Edición cancelada");
})

formularioAlta.addEventListener("submit", (event)=>{
    event.preventDefault();

    if(idEditando === null){
        const nombre = campoNombre.value.trim();
        const categoria = campoCategoria.value;
        const precio = Number(campoPrecio.value);
        const unidad = document.querySelector("input[name='unidad']:checked").value;
        const stock = Number(campoStock.value);
        const oferta = casillaOferta.checked;

        let validez = validarFormulario();

        if(validez === false){
            console.log("Alta: el formulario tiene errores");
            return;
        }

        let producto = crearProducto(siguienteId, nombre, categoria, precio, unidad, stock);

        producto.oferta = oferta;

        productos.push(producto);
        siguienteId++;

        console.log(`Alta: ${nombre} (codigo ${producto.id}), ${precio.toFixed(2)} €/${unidad}, stock ${stock}`);

        pintar();
        formularioAlta.reset();
        contadorSpan.textContent = "0 / 30";
        campoNombre.focus();
    } else {
        const nombre = campoNombre.value.trim();
        const categoria = campoCategoria.value;
        const precio = Number(campoPrecio.value);
        const unidad = document.querySelector("input[name='unidad']:checked").value;
        const stock = Number(campoStock.value);
        const oferta = casillaOferta.checked;

        let validez = validarFormulario();

        if(validez === false){
            console.log("Alta: el formulario tiene errores");
            return;
        }

        const producto = buscarProducto(idEditando);

        producto.nombre = nombre;
        producto.categoria = categoria;
        producto.precio = precio;
        producto.unidad = unidad;
        producto.stock = stock;
        producto.oferta = oferta;

        console.log(`Modificado: ${nombre} (codigo ${producto.id}), ${precio.toFixed(2)} €/${unidad}, stock ${stock}`);

        pintar();
        formularioAlta.reset();

        idEditando = null;

        tituloGestion.textContent = "Alta de producto";
        botonGuardar.textContent = "Dar de alta";
        botonCancelar.hidden = true;
        contadorSpan.textContent = "0 / 30";

        campoNombre.focus();
    }
    
});

campoNombre.addEventListener("input", () => {

    if (campoNombre.value.length > 30) {
        campoNombre.value = campoNombre.value.slice(0, 30);
    }

    contadorSpan.textContent = `${campoNombre.value.length} / 30`;
});

campoNombre.addEventListener("blur", ()=>{
    if (campoNombre.value.trim() !== "") {
        comprobarNombre();
        mostrarError(campoNombre, errorNombre, mensajeNombre());
    }
});

//VALIDACION Y ERRORES

function mensajeNombre(){
    const v = campoNombre.validity;

    if(v.valueMissing) return "El nombre es obligatorio";
    if(v.tooShort) return "Mínimo 3 caractéres";
    if(v.customError) return campoNombre.validationMessage;

    return "";
}

function mensajePrecio() {
  const v = campoPrecio.validity;
  if (v.valueMissing) return "El precio es obligatorio";
  if (v.rangeUnderflow || v.rangeOverflow) return "Entre 0.10 y 100 €";
  if (v.stepMismatch) return "Como mucho dos decimales";

  return "";
}

function mensajeCategoria(){
    if(campoCategoria.value === ""){
        return "Elige una categoría"
    }

    return "";
}

function mensajeStock(){

    const v = campoStock.validity;

    if(v.valueMissing || v.rangeOverflow || v.rangeUnderflow){
        return "El Stock es obligatorio (puede ser 0), un número entre 0 y 999";
    }

    return "";
}

function mostrarError(campo, zona, mensaje){
    zona.textContent = mensaje; // "" si no hay error
    campo.classList.toggle("invalido", mensaje !== "");
}

const errorNombre = document.querySelector(".error-nombre");
const errorCategoria = document.querySelector(".error-categoria");
const errorPrecio = document.querySelector(".error-precio");
const errorStock = document.querySelector(".error-stock");
const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{3,30}$/;

function comprobarNombre() {
  const nombre = campoNombre.value.trim();
  let mensaje = "";
  if (nombre !== "" && !nombreValido.test(nombre)) mensaje = "Solo letras y espacios";

  for (let producto of productos){
    if(producto.nombre.toLowerCase() === nombre.toLowerCase() && producto.id !== idEditando) mensaje = "Ya existe un producto con ese nombre";
  }

  campoNombre.setCustomValidity(mensaje);
}

function validarFormulario(){

    comprobarNombre();

    mostrarError(campoNombre, errorNombre, mensajeNombre());
    mostrarError(campoCategoria, errorCategoria, mensajeCategoria());
    mostrarError(campoPrecio, errorPrecio, mensajePrecio());
    mostrarError(campoStock, errorStock, mensajeStock());

    return formularioAlta.checkValidity();
}

//-----------------------------------------------
pintar();