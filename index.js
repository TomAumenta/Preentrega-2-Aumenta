document.addEventListener('DOMContentLoaded', () => {
    const productos = [
        { nombre: 'Procesador Ryzen 3 3200g', precio: 100000 },
        { nombre: 'Ryzen 5 5600g', precio: 200000 },
        { nombre: 'Memoria Ram ddr5 8gb', precio: 25000 },
        { nombre: 'Monitor Gamer 144hz', precio: 280000 },
        { nombre: 'Mouse Logitech G Pro', precio: 70000 }
    ];

    let carrito = [];

    const productosDiv = document.getElementById('productos');
    const itemsDelCarrito = document.getElementById('items-del-carrito');
    const total = document.getElementById('total');
    const buscarInput = document.getElementById('buscar');

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
        mostrarCarrito();
    }

    function mostrarCarrito() {
        console.clear();  
        let precioTotal = 0;

        carrito.forEach(item => {
            console.log(`${item.nombre} - $${item.precio} x ${item.cantidad}`);
            precioTotal += item.precio * item.cantidad;
        });

        console.log(`Total: $${precioTotal.toFixed(2)}`);
    }

    buscarInput.addEventListener('input', () => {
        const filtro = buscarInput.value;
        mostrarProductos(filtro);
    });

    mostrarProductos(); 
});
