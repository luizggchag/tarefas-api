const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const getTarefas = (request, response) => {
    pool.query('SELECT * FROM tarefas', (error, results) => {
        if (error) {
            return response.status(401).json({
                status: 'error',
                message: 'Erro: ' + error
            });
        }
        response.status(200).json(results.rows)
    })
}

const addTarefa = (request, response) => {
    const { descricao, situacao } = request.body

    pool.query(
        'INSERT INTO tarefas (descricao, situacao) VALUES ($1, $2)',
        [descricao, situacao],
        (error) => {
            if (error) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Erro: ' + error
                });
            }
            response.status(201).json({ status: 'success', message: 'Tarefa criada.' })
        },
    )
}

const updateTarefa = (request, response) => {
    const { codigo, descricao, situacao } = request.body
    pool.query('UPDATE tarefas set descricao=$1, situacao=$2 where codigo=$3',
        [descricao, situacao, codigo], error => {
            if (error) {
                return response.status(401).json({
                    status: 'error',
                    message: 'Erro: ' + error
                });
            }
            response.status(201).json({ status: 'success', message: 'Tarefa atualizada.' })
        })
}

const deleteTarefa = (request, response) => {
    const codigo = parseInt(request.params.id);
    pool.query('DELETE FROM tarefas where codigo = $1', [codigo], error => {
        if (error) {
            return response.status(401).json({
                status: 'error',
                message: 'Erro: ' + error
            });
        }
        response.status(201).json({ status: 'success', message: 'Tarefa apagada.' })
    })
}

const getTarefaPorID = (request, response) => {
    const codigo = parseInt(request.params.id);
    pool.query('SELECT * FROM tarefas where codigo = $1', [codigo], (error, results) => {
        if (error) {
            return response.status(401).json({
                status: 'error',
                message: 'Erro: ' + error
            });
        }
        response.status(200).json(results.rows)
    })
}

app
    .route('/tarefas')
    // GET endpoint
    .get(getTarefas)
    // POST endpoint
    .post(addTarefa)
    // PUT
    .put(updateTarefa)

app.route('/tarefas/:id')
    .get(getTarefaPorID)
    .delete(deleteTarefa)

// Start server
app.listen(process.env.PORT || 3003, () => {
    console.log(`Servidor rodando na porta 3003`)
})