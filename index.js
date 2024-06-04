document.addEventListener('DOMContentLoaded', () => {
    let productos = [];
    let carrito = cargarCarritoDesdeLocalStorage();

    const productosDiv = document.getElementById('productos');
    const itemsDelCarrito = document.getElementById('items-del-carrito');
    const total = document.getElementById('total');
    const buscarInput = document.getElementById('buscar');
    const notificacion = document.getElementById('notificacion');
    const btnAgregarProducto = document.getElementById('agregarProducto');

   
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            mostrarProductos();
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    function mostrarProductos(filtro = '') {
        productosDiv.innerHTML = '';
        const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(filtro.toLowerCase()));

        productosFiltrados.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto';
            productoDiv.innerHTML = `
                <h2>${producto.nombre}</h2>
                <p>Precio: $${producto.precio}</p>
                <button class="añadir-al-carrito" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Añadir al Carrito</button>
            `;
            productosDiv.appendChild(productoDiv);
        });

        document.querySelectorAll('.añadir-al-carrito').forEach(button => {
            button.addEventListener('click', () => {
                const nombre = button.getAttribute('data-nombre');
                const precio = parseFloat(button.getAttribute('data-precio'));
                añadirAlCarrito(nombre, precio);
                mostrarNotificacion('Producto añadido al carrito', 'success');
            });
        });
    }

    function añadirAlCarrito(nombre, precio) {
        const item = carrito.find(producto => producto.nombre === nombre);
        if (item) {
            item.cantidad++;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
    }

    function mostrarCarrito() {
        itemsDelCarrito.innerHTML = '';
        let precioTotal = 0;

        carrito.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-del-carrito';
            itemDiv.innerHTML = `
                <p>${item.nombre} - $${item.precio} x ${item.cantidad}</p>
                <button class="eliminar-uno-del-carrito" data-nombre="${item.nombre}">Eliminar Uno</button>
                <button class="eliminar-todos-del-carrito" data-nombre="${item.nombre}">Eliminar Todos</button>
            `;
            itemsDelCarrito.appendChild(itemDiv);
            precioTotal += item.precio * item.cantidad;
        });

        document.querySelectorAll('.eliminar-uno-del-carrito').forEach(button => {
            button.addEventListener('click', () => {
                const nombre = button.getAttribute('data-nombre');
                eliminarUnoDelCarrito(nombre);
                mostrarNotificacion('Un producto eliminado del carrito', 'info');
            });
        });

        document.querySelectorAll('.eliminar-todos-del-carrito').forEach(button => {
            button.addEventListener('click', () => {
                const nombre = button.getAttribute('data-nombre');
                eliminarTodosDelCarrito(nombre);
                mostrarNotificacion('Todos los productos eliminados del carrito', 'warning');
            });
        });

        total.textContent = `Total: $${precioTotal.toFixed(2)}`;
    }

    function eliminarUnoDelCarrito(nombre) {
        const item = carrito.find(producto => producto.nombre === nombre);
        if (item) {
            if (item.cantidad > 1) {
                item.cantidad--;
            } else {
                carrito = carrito.filter(producto => producto.nombre !== nombre);
            }
        }
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
    }

    function eliminarTodosDelCarrito(nombre) {
        carrito = carrito.filter(producto => producto.nombre !== nombre);
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
    }

    function mostrarNotificacion(mensaje, tipo) {
        notificacion.textContent = mensaje;
        notificacion.className = `notificacion ${tipo}`;
        notificacion.style.display = 'block';
        setTimeout(() => {
            notificacion.style.display = 'none';
        }, 3000);
    }

    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDesdeLocalStorage() {
        const carritoGuardado = localStorage.getItem('carrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    btnAgregarProducto.addEventListener('click', () => {
        const nombre = prompt("Ingrese el nombre del producto:");
        const precio = parseFloat(prompt("Ingrese el precio del producto:"));
        if (nombre && !isNaN(precio)) {
            const nuevoProducto = { nombre, precio };
            productos.push(nuevoProducto);
            mostrarProductos();
            mostrarNotificacion('Producto agregado exitosamente', 'success');
        } else {
            mostrarNotificacion('Error al agregar el producto', 'error');
        }
    });

    buscarInput.addEventListener('input', () => {
        const filtro = buscarInput.value;
        mostrarProductos(filtro);
    });

    mostrarProductos();
    mostrarCarrito(); 
});
