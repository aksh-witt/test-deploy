//Carrinho, eu juro por Deus que eu não aguento mais, essa porra de adicionar produto não funciona

let cart = [];

// Função para adicionar um item ao carrinho
function addToCart(itemName, itemPrice) {
    const item = {
        name: itemName,
        price: itemPrice,
    };

    cart.push(item);
    localStorage.setItem('carrinho', JSON.stringify(cart)); // Armazena no localStorage
    renderCart();
}

// Função para renderizar os itens do carrinho
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-itens');
    cartItemsContainer.innerHTML = ''; // Limpa o contêiner

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item'; // Adiciona a classe cart-item

        cartItemDiv.innerHTML = `
            <span class="data-name">${item.name}</span>
            <span class="data-preco">R$ ${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${index})">Remover</button>
        `;

        cartItemsContainer.appendChild(cartItemDiv); // Adiciona o item ao contêiner
    });

    document.getElementById('totalValue').innerText = `R$ ${total.toFixed(2)}`; // Atualiza o total
}

// Função para remover um item do carrinho
function removeFromCart(index) {
    cart.splice(index, 1); // Remove o item do array
    localStorage.setItem('carrinho', JSON.stringify(cart)); // Atualiza o localStorage
    renderCart(); // Renderiza o carrinho novamente
}

// Adicionando evento ao botão de checkout
document.getElementById('checkout-button').addEventListener('click', () => {
    alert('Finalizando a compra!');
});

// Chama a função ao carregar a página
window.onload = () => {
    cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    renderCart();
};