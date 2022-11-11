const express = require('express');
const { MongoClient, ObjectId } = require("mongodb");

//estabelecendo conexão com banco
//const url = "mongodb://localhost:27017";
const url = "mongodb+srv://admin:Cg2ORbhpjvk2dl89@cluster0.xnjkut9.mongodb.net/";
const bancoDadosNome = "ocean_jornada_fullstack_novembro_2022";

async function main(){
    console.log("conectando ao banco de dados");

    //realiza a conexão com o client
    const client = await MongoClient.connect(url);
    
    // Obtém acesso ao banco de dados
    const bancoDados = client.db(bancoDadosNome);
    const collection = bancoDados.collection("itens");
    const app = express();

    //Sinalizamos que estamos usando JSON no body
    app.use(express.json());

    app.get('/', function (req, res) {
    res.send('Hello World')
    });

    // criando novo endpoint
    app.get('/oi', function (req, res) {
        res.send('Olá mundo')
    });

    // lista de informações
    const itens = ["Café Pelé", "Café Pilão"];

    // endpoint [GET] /itens - READ ALL
    app.get("/itens", async function(req, res){
        // Leio todos os documentos da collection
        const documentos = await collection.find().toArray();
        
        // Envio como resposta para o endpoint
        res.send(documentos);
    });

    // endpoint [POST] /itens - CREATE
    app.post("/itens", async function(req, res){
        // console.log(req.body);
        
        // pegamos o objeto inteiro enviado no body
        const item = req.body;
        
        // inserir o valor recebido na collection
        await collection.insertOne(item);
        res.send("Item criado com sucesso!");
    });

    // endpoint [GET] /itens/:id - READ BY ID
    app.get("/itens/:id", async function (req, res){
        // pegamos o parâmetro de rota ID
        const id = req.params.id;

        // Realizamos uma busca no banco de dados
        const item = await collection.findOne({
            _id: new ObjectId(id),  
        });

        // mostra o item
        res.send(item);
    });

    //endpoint [PUT] /itens/:id - UPDATE BY ID
    app.put("/itens/:id", async function(req, res){
        // pegamos o parâmetro de rota ID
        const id = req.params.id;

        // acessamos o item pelo indice
        const item = req.body;

        // atualizamos o item no banco de dados
        await collection.updateOne(
            {_id: new ObjectId(id)},
            { $set: item },
        );

        res.send("Item atualizado com sucesso!");
    });

    // endpoint [DELETE] /itens/:id - DELETE BY ID
    app.delete("/itens/:id", async function(req, res){
        // pegamos o parâmetro de rota ID
        const id = req.params.id;

        // remove o item da lista
        await collection.deleteOne({
            _id: new ObjectId(id),
        });

        // exibimos uma mensagem
        res.send("Item removido com sucesso!");
    });

    app.listen(3000, function(){
        console.log("servidor rodando em http://localhost:3000");
    });
}

main();