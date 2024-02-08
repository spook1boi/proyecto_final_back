document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/products'); // Ruta de tu API para obtener los productos
        const { products } = await response.json();

        renderizarProductos(products);
    } catch (error) {
        console.error('Error al cargar la lista de productos:', error);
    }
});

function renderizarProductos(productos) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    productos.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${producto.description}</strong><br>
            Precio: $${producto.price}<br>
            Stock: ${producto.stock}<br>
            Categoría: ${producto.category}<br>
            <a href="/products/${producto._id}?email={{user.email}}">Ver Detalle</a>
        `;
        productsContainer.appendChild(li);
    });
}