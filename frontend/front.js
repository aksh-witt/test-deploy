document.addEventListener("DOMContentLoaded", function() {
    // Verifica se o elemento que contém as imagens do carrossel existe
    const imgs = document.getElementById("img");
    if (imgs) {
        const img = document.querySelectorAll("#img img"); // Seleciona todas as imagens dentro do elemento 'imgs'
        let idx = 0; // Índice inicial do carrossel

        /**
         * Avança a imagem do carrossel, movendo o contêiner de imagens.
         * Reseta o índice quando atinge o final da lista de imagens.
         */
        function carrossel() {
            idx++;

            if (idx > img.length - 1) {
                idx = 0; // Reseta o índice para o início
            }

            // Aplica a transformação de translação para mostrar a próxima imagem
            imgs.style.transform = `translateX(${-idx * 500}px)`;
        }

        // Inicia o carrossel que avança a cada 2400 ms
        setInterval(carrossel, 2400);
    }

    // Configura o evento de click para o botão drop-down, se existir
    const dropdownBtn = document.querySelector(".dropdown-icon");
    if (dropdownBtn) {
        dropdownBtn.addEventListener("click", toggleDropdown);
    }

    // Configura o evento de submit para o formulário de cadastro de produtos
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', cadastrarProduto);
    }

    // Carrega as informações do usuário na página
    carregarInformacoesDoUsuario();

    // Verifica se há informações do usuário armazenadas localmente
    const userInfo = localStorage.getItem('Informacoes');
    if (userInfo) {
        let dados = JSON.parse(userInfo);
        // Exibe o botão de cadastrar produto somente para usuários admin
        document.getElementById('cadastrar_produto').style.display = dados.perfil === 'admin' ? 'block' : 'none';
    }
});




//menuzada com o drop

// Função para mostrar/ocultar o menu drop-down
function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Fechar o menu se o usuário clicar fora dele
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-icon')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


//login quicando e mamando 
async function cadastrar(event) {
    event.preventDefault();  // Previne o comportamento padrão do formulário

    // Coleta os dados do formulário
    const name = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('senha').value;

    // Verifica se os campos estão preenchidos
    if (!name || !email || !pass) {
        alert("Todos os campos devem ser preenchidos!");
        return;
    }

    // Cria o objeto com os dados a serem enviados para a API
    const data = { name, email, pass };

    try {
        // Realiza a requisição POST para a API
        const response = await fetch('http://localhost:3005/usuario/cadastrar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // Converte a resposta em JSON
        const result = await response.json();

        // Lida com a resposta
        if (response.ok) {
            alert(result.message);
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (error) {
        console.error('Erro durante o cadastro:', error);
        alert("Ocorreu um erro ao tentar realizar o cadastro.");
    }
}



//login NÃO É O CADASTRO



async function logar(event) {
    event.preventDefault();  // Previne o comportamento padrão do formulário

    // Coleta os dados do formulário
    const email = document.getElementById('email_login').value;
    const pass = document.getElementById('password_login').value;

    // Verifica se os campos estão preenchidos
    if (!email || !pass) {
        alert("Todos os campos devem ser preenchidos!");
        return;
    }

    // Cria o objeto com os dados a serem enviados para a API
    const data = { email, pass };

    try {
        const response = await fetch("http://localhost:3005/login", {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data),
        });

        let results = await response.json();

        if (results.success) {
            alert(results.message);

            // Armazena os dados do usuário no localStorage para persistir o login
            let userData = results.data;
            localStorage.setItem('Informacoes', JSON.stringify(userData));

            // Redireciona o usuário para a página index.html
            window.location.href = "../index.html";
            
        } else {
            alert(results.message);
        }
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        alert("Erro ao realizar login. Tente novamente mais tarde.");
    }
}



// verifica se o usuário está logado em outra pag
window.onload = function() {
    let userData = localStorage.getItem('Informacoes');
    
    if (!userData) {
        // Se não há dados de login, redireciona para a página de login
        window.location.href = "";
    } else {
        // Caso o usuário esteja logado, você pode exibir as informações dele
        userData = JSON.parse(userData);
        document.getElementById('user-info').innerHTML = `Bem-vindo, ${userData.name} - Perfil: ${userData.perfil}`;
    }
}

//log out/ sair
function logout() {
    // Remove os dados do usuário do localStorage
    localStorage.removeItem('Informacoes');

    // Redireciona para a página de login
    window.location.href = "login/login.html";
}






// //recuperar info pra pag

function loadUserInfo() {
    const userInfo = localStorage.getItem('Informacoes');

    if (userInfo) {
        const user = JSON.parse(userInfo);
        document.getElementById('nome').textContent = ` ${user.name}`;
        document.getElementById('email').textContent = `${user.email}`;
    } else {
    
    }
}

// Chama a função ao carregar a página
window.onload = loadUserInfo;


//cadastrar produto

document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    const formData = new FormData(this); // Cria um FormData com os dados do formulário

    try {
        const response = await fetch('http://localhost:3005/produtos/cadastrar', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json(); // Parseia a resposta como JSON

        if (response.ok) {
            alert(result.message); // Exibe a mensagem de sucesso
            // Limpar o formulário
            this.reset(); 
        } else {
            alert(`Erro: ${result.message}`); // Exibe mensagem de erro
        }
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        alert('Ocorreu um erro ao cadastrar o produto.'); // Mensagem de erro geral
    }
});


//

const userInfo = localStorage.getItem("Informacoes");
if (userInfo) {
    let dados = JSON.parse(userInfo);
    document.getElementById('cadastrar_produto').style.display = dados.perfil === 'admin' ? 'block' : 'none';
}


// async function fetchProducts() {
//     try {
//         const response = await fetch('http://localhost:3005/produtos'); // Faz uma requisição GET para a rota de produtos
//         const products = await response.json();

//         const productList = document.getElementById('productList');
//         productList.innerHTML = ''; // Limpa o conteúdo antes de exibir os produtos

//         products.forEach(product => {
//             const productDiv = document.createElement('div');
//             productDiv.innerHTML = `
//                 <h3>${product.nome}</h3>
//                 <p>Preço: R$${product.preco}</p>
//                 <img src="./uploads${product.imagem}" alt="${product.nome}" width="150">
//             `;
//             productList.appendChild(productDiv);
//         });
//     } catch (error) {
//         console.error('Erro ao buscar produtos:', error);
//         alert('Ocorreu um erro ao carregar os produtos.');
//     }
// }

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3005/produtos'); // Verifique se esta rota retorna JSON
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        const products = await response.json();
        const productList = document.getElementById('productList'); // Verifique se esse elemento existe
        productList.innerHTML = ''; // Limpa o conteúdo antes de exibir os produtos

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.innerHTML = `
                <h3>${product.nome}</h3>
                <p>Preço: R$${product.preco}</p>
                <img src="./uploads/${product.imagem}" alt="${product.nome}" width="150">
            `;
            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        alert('Ocorreu um erro ao carregar os produtos.');
    }
}

function listarProdutos() {
    fetchProducts();
}



// Chama a função para buscar os produtos quando a página carregar
window.onload = fetchProducts;

window.addEventListener("load", () => {
    listarProdutos();
    
    const userInfo = localStorage.getItem("Informacoes");
    if (userInfo) {
        let html = document.getElementById('Informacoes');
        let dados = JSON.parse(userInfo);
        
        document.getElementById('cadastrar_produto').style.display = dados.perfil === 'admin' ? 'block' : 'none';
        
        html.innerHTML = `<div style="display: flex; flex-direction: column; align-items: end">
            ${dados.perfil} ${dados.email}
        </div>`;
        html.style.display = 'block';
    }
});

window.addEventListener("load", () => {
    // Função para listar produtos
    // listarProdutos();
    
    // Função para carregar informações do usuário
    carregarInformacoesDoUsuario();
});

// function carregarInformacoesDoUsuario() {
//     try {
//         const userInfo = localStorage.getItem("Informacoes");

//         if (!userInfo) {
//             console.warn("Nenhuma informação de usuário encontrada no localStorage.");
//             return;
//         }

//         const dados = JSON.parse(userInfo);

//         // Verifica se o perfil do usuário e o elemento de cadastro de produto existem
//         const formularioCadastroProduto = document.getElementById('cadastrar_produto');
//         if (formularioCadastroProduto) {
//             formularioCadastroProduto.style.display = dados.perfil === 'admin' ? 'block' : 'none';
//         } else {
//             console.error("Elemento 'cadastrar_produto' não encontrado no DOM.");
//         }

//         // Verifica se o elemento de informações do usuário existe
//         const infoUsuario = document.getElementById('Informacoes'); 
//         if (infoUsuario) {
//             infoUsuario.innerHTML = `
//                 <div style="display: flex; flex-direction: column; align-items: end">
//                     Perfil: ${dados.perfil} <br>
//                     Email: ${dados.email}
//                 </div>`;
//             infoUsuario.style.display = 'block';
//         } else {
//             console.error("Elemento 'Informacoes' não encontrado no DOM.");
//         }

//     } catch (error) {
//         console.error("Erro ao carregar informações do usuário: ", error);
//     }
// }

// function carregarInformacoesDoUsuario() {
//     try {
//         const userInfo = localStorage.getItem("Informacoes");

//         if (!userInfo) {
//             console.warn("Nenhuma informação de usuário encontrada no localStorage.");
//             return;
//         }

//         const dados = JSON.parse(userInfo);

//         // Verifica se o perfil do usuário e o elemento de cadastro de produto existem
//         const formularioCadastroProduto = document.getElementById('cadastrar_produto');
//         if (formularioCadastroProduto) {
//             formularioCadastroProduto.style.display = dados.perfil === 'admin' ? 'block' : 'none';
//         } else {
//             console.error("Elemento 'cadastrar_produto' não encontrado no DOM.");
//         }

//         // Verifica se o elemento de informações do usuário existe
//         const infoUsuario = document.getElementById('Informacoes'); // Corrigido o ID
//         if (infoUsuario) {
//             infoUsuario.innerHTML = `
//                 <div style="display: flex; flex-direction: column; align-items: end">
//                     Perfil: ${dados.perfil} <br>
//                     Email: ${dados.email}
//                 </div>`;
//             infoUsuario.style.display = 'block';
//         } else {
//             console.error("Elemento 'Informacoes' não encontrado no DOM.");
//         }

//     } catch (error) {
//         console.error("Erro ao carregar informações do usuário: ", error);
//     }
// }

// teste

document.addEventListener("DOMContentLoaded", function() {
    // Carregar informações do usuário
    carregarInformacoesDoUsuario();

    // Configura o evento de click para o botão drop-down, se existir
    const dropdownBtn = document.querySelector(".dropdown-icon");
    if (dropdownBtn) {
        dropdownBtn.addEventListener("click", toggleDropdown);
    }

    // Atualiza para acessar o botão de cadastro
    const cadastrarButton = document.querySelector('.botao1');
    if (cadastrarButton) {
        cadastrarButton.addEventListener('click', cadastrarProduto);
    }

    // Verifica se há informações do usuário armazenadas localmente
    const userInfo = localStorage.getItem('Informacoes');
    if (userInfo) {
        let dados = JSON.parse(userInfo);
        document.getElementById('cadastrar_produto').style.display = dados.perfil === 'admin' ? 'block' : 'none';
    }
});

//

function carregarInformacoesDoUsuario() {
    try {
        const userInfo = localStorage.getItem("Informacoes");

        if (!userInfo) {
            console.warn("Nenhuma informação de usuário encontrada no localStorage.");
            return;
        }

        const dados = JSON.parse(userInfo);

        // Verifica se o perfil do usuário e o elemento de cadastro de produto existem
        const formularioCadastroProduto = document.getElementById('cadastrar_produto');
        if (formularioCadastroProduto) {
            formularioCadastroProduto.style.display = dados.perfil === 'admin' ? 'block' : 'none';
        }

        // Verifica se o elemento de informações do usuário existe
        const infoUsuario = document.getElementById('informacoes');
        if (infoUsuario) {
            infoUsuario.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: end">
                    Perfil: ${dados.perfil} <br>
                    Email: ${dados.email}
                </div>`;
            infoUsuario.style.display = 'block';
        }
    } catch (error) {
        console.error("Erro ao carregar informações do usuário: ", error);
    }
}



async function cadastrarProduto(event) {
    event.preventDefault();

    // Coletando valores do formulário
    const title = document.getElementById('nome').value.trim(); 
    const price = parseFloat(document.getElementById('preco').value); // Utilizando parseFloat para garantir um valor decimal, o Number não tava pegando eu acho
    const file = document.getElementById('file').files[0];
    const descricao = document.getElementById('description').value.trim();

    // Validação de campos
    if (!title || isNaN(price) || price <= 0 || !file || !descricao) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Criando um objeto FormData
    let formData = new FormData();
    formData.append('nome', title);
    formData.append('preco', price);
    formData.append('file', file);
    formData.append('description', descricao);

    try {
        const response = await fetch('http://localhost:3005/produtos/cadastrar', {
            method: "POST",
            body: formData
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }

        const results = await response.json();
        alert(results.message);

        // limpar os campos do formulário após o cadastro
        document.getElementById('nome').value = '';
        document.getElementById('preco').value = '';
        document.getElementById('file').value = '';
        document.getElementById('description').value = '';

    } catch (error) {
        alert(`Erro ao cadastrar produto: ${error.message}`);
    }
}
