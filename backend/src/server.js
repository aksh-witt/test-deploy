const express = require("express");
const cors = require("cors");
const connection = require('./db_config'); 
const multer = require('multer');
const path = require('path');

const port = 3005;



const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Rodando porta ${port}`));

// Rota POST /usuario/cadastrar
app.post('/usuario/cadastrar', async (request, response) => {
    const { name, email, pass } = request.body; 

    // Query para inserir os dados
    let query = "INSERT INTO users(name, email, password) VALUES (?, ?, ?)";

    // Executar a query no banco de dados
    connection.query(query, [name, email, pass], (err, results) => {
        if (err) {
            return response.status(400).json({
                success: false,
                message: "Erro ao cadastrar usuário",
                error: err
            });
        }
        response.status(201).json({
            success: true,
            message: "Usuário cadastrado com sucesso",
            data: results
        });
    });
});


//login é post tbm (|-|)
app.post('/login', (request, response) => {
    const email = request.body.email;
    const pass = request.body.pass;

    // Verifica se os campos foram enviados corretamente
    if (!email || !pass) {
        return response.status(400).json({
            success: false,
            message: "Campos de email e senha são obrigatórios.",
        });
    }

    // Cria a query SQL para buscar o usuário
    let query = "SELECT id, name, email, password, perfil FROM users WHERE email = ?";
    let params = [email];  // Adiciona o email nos parâmetros

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error("Erro ao consultar o banco de dados:", err);
            return response.status(500).json({
                success: false,
                message: "Erro no servidor.",
            });
        }

        // Verifica se o email existe no banco
        if (results.length > 0) {
            const senhaDigitada = pass;
            const senhaBanco = results[0].password;

            // Compara a senha enviada com a senha armazenada no banco de dados
            if (senhaBanco === senhaDigitada) {
                return response.status(200).json({
                    success: true,
                    message: "Login realizado com sucesso!",
                    data: results[0],  // Envia os dados do usuário (menos a senha)
                });
            } else {
                return response.status(400).json({
                    success: false,
                    message: "Credenciais inválidas.",
                });
            }
        } else {
            return response.status(400).json({
                success: false,
                message: "Credenciais inválidas.",
            });
        }
    });
});

// CADASTRO FUNC


// Tem que vir antes da rota que usa
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Pasta imagens 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Nome único para o arquivo
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// // Aqui a rota está abaixo da inicialização do 'upload'
// app.post('/produtos/cadastrar', upload.single('imagem'), (req, res) => { //troquei 'imagem'
//     const { nome, preco } = req.body; // troquei 'nome' e
//     const imagem = req.file;  // A imagem enviada

//     // Verifica se a imagem foi enviada corretamente
//     if (!imagem) {
//         return res.status(400).json({ message: "A imagem é obrigatória." });
//     }

//     // Monta a query pra inserir
//     const query = `INSERT INTO produtos (nome, price, imagem, description) VALUES (?, ?, ?)`;

//     // Executa a query
//     connection.query(query, [nome, preco, imagem.path, description], (err, result) => {
//         if (err) {
//             console.error('Erro ao inserir produto no banco de dados:', err);
//             return res.status(501).json({ message: "Erro ao cadastrar o produto." });
//         }

//         // Retorna uma resposta de sucesso
//         res.status(200).json({ message: "Produto cadastrado com sucesso!" });
//     });
// });


app.post('/produtos/cadastrar', upload.single('imagem'), (req, res) => {
    const { nome, preco, description } = req.body; // Incluindo description
    const imagem = req.file;  // A imagem enviada

    // Verifica se a imagem foi enviada corretamente
    if (!imagem) {
        return res.status(400).json({ message: "A imagem é obrigatória." });
    }

    // Monta a query pra inserir
    const query = `INSERT INTO produtos (nome, preco, imagem, description) VALUES (?, ?, ?, ?)`;

    // Executa a query
    connection.query(query, [nome, preco, imagem.path, description], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto no banco de dados:', err);
            return res.status(501).json({ message: "Erro ao cadastrar o produto." });
        }

        // Retorna uma resposta de sucesso
        res.status(201).json({ message: "Produto cadastrado com sucesso!" });
    });
});




// app.post('/produtos/cadastrar', upload.single('file'), (request, response) => {
//     let params = [
//         request.body.nome,
//         request.body.preco,
//         request.file.filename,
//         request.body.description
//     ];

//     let query = 'insert into produtos(nome, preco, imagem, description) values(?,?,?,?)';

//     connection.query(query, params, (err, results) => {
//         if (err) {
//             response.status(400).json({
//                 success: false,
//                 message: "Erro ao cadastrar produto.",
//                 data: err
//             });
//         } else {
//             response.status(201).json({
//                 success: true,
//                 message: "Produto cadastrado com sucesso.",
//                 data: results
//             });
//         }
//     });
// });

app.use('/uploads', express.static(__dirname + '/public'));

app.get('/produtos/listar', (request, response) => {
    let query = "select * from produtos";

    connection.query(query, (err, results) => {
        if (err) {
            // Aqui você deve lidar com o erro de forma adequada
            return response.status(500).json({
                success: false,
                message: "Erro ao consultar produtos",
                error: err.message
            });
        }

        // Se não houver erro, mas também não houver resultados, é melhor lidar com isso
        if (results && results.length > 0) {
            response.status(200).json({
                success: true,
                message: "Sucesso",
                data: results
            });
        } else {
            response.status(404).json({ 
                success: false,
                message: "Nenhum produto encontrado",
                data: results
            });
        }
    });
});

app.put('/produto/editar/:id', upload.single('file'), (req, res) => {
    const productId = req.params.id;
    const { name, price, description } = req.body;

    let query;
    let params;

    if (req.file) {
        // Se houver nova imagem
        query = 'UPDATE produtos SET titel = ?, price = ?, imagem = ?, description = ? WHERE id = ?';
        params = [nome, preco, req.file.filename, description, productId];
    } else {
        // Sem nova imagem
        query = 'UPDATE produtos SET title = ?, price = ?, description = ? WHERE id = ?';
        params = [nome, preco, description, productId];
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(400).json({ success: false, message: "Erro ao editar produto", error: err });
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Produto atualizado com sucesso", data: results });
        } else {
            res.status(404).json({ success: false, message: "Produto não encontrado" });
        }
    });
});

app.delete('/produto/excluir/:id', (request, response) => {
    const productId = request.params.id;

    if (!productId) {
        return response.status(400).json({
            success: false,
            message: "ID do produto não fornecido."
        });
    }
    
    let query = 'DELETE FROM produtos WHERE id = ?';

    connection.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            return response.status(500).json({
                success: false,
                message: "Erro no servidor ao excluir produto.",
                error: err.message
            });
        }

        if (results.affectedRows > 0) {
            response.status(200).json({
                success: true,
                message: "Produto excluído com sucesso.",
                data: results
            });
        } else {
            response.status(404).json({
                success: false,
                message: "Nenhum produto encontrado para exclusão.",
                data: results
            });
        }
    });
});
