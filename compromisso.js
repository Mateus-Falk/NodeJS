const pool = require('./conexao')



module.exports = {
    async listar(req, res){
        let client = ''
        try {
            client = await pool.connect()
            let result = await client.query('select * from tb_compromissos')
            res.status(200).send(result.rows);
        } catch (error) {
            res.status(400).send({Erro: error.message})
        }
        finally{
            if(client != '')
                client.release()
        }
    },

    async listarById(req, res){
        let client = ''
        try {
            
            client = await pool.connect()

            let result = await client.query('select * from tb_compromissos where id = $1', [req.params.idcompromisso])
            if(result.rowCount > 0){   
                res.status(200).send(result.rows[0]);
            } else{
                res.status(400).send({message: 'Compromisso não encontrado'})
            }

        } catch (error) {
            res.status(400).send({Erro: error.message})
        }
        finally{
            if(client != '')
                client.release()
        }
    },

    async adicionar(req,res){
        let client = ''
        try {
            
            client = await pool.connect()
            let sql = 'insert into tb_compromissos (descricao, local, data, hora, idcontato, status) values($1, $2, $3, $4, $5, $6)';
            let dados = [req.body.descricao, req.body.local, req.body.data, req.body.hora, req.body.idcontato, req.body.status];
            await client.query(sql, dados);
            res.status(200).send({message: `Compromisso: ${req.body.descricao} inserido com sucesso`})

        } catch (error) {
            res.status(400).send({Erro: error.message})
        }
        finally{
            if(client != '')
                client.release()
        }
    },

    async editar(req, res){
        let client = ''
        try {
            
            client = await pool.connect()
            let result = await client.query('select * from tb_compromissos where id = $1', [req.params.idcompromisso])
            if(result.rowCount > 0){   
                let sql = 'update tb_compromissos set descricao = $1,  local = $2, data = $3, hora = $4, idcontato = $5, status = $6 where id = $7';
                let dados = [req.body.descricao, req.body.local, req.body.data, req.body.hora, req.body.idcontato, req.body.status, req.params.idcompromisso];
                await client.query(sql, dados);
                res.status(200).send({message: `Compromisso: ${req.body.descricao} atualizado com sucesso`})
            } else{
                res.status(400).send({message: 'Compromisso não encontrado'})
            }
        } catch (error) {
            res.status(400).send({Erro: error.message})
        }
        finally{
            if(client != '')
                client.release()
        }
    },

    async editarStatus(req, res){
        let client = ''
        try {
            
            client = await pool.connect()
            let result = await client.query('select * from tb_compromissos where id = $1', [req.params.idcompromisso])
            if(result.rowCount > 0){   
                let sql = 'update tb_compromissos set status = $1 where id = $2';
                let dados = [req.params.setstatus, req.params.idcompromisso];
                await client.query(sql, dados);
                res.status(200).send({message: `Status atualizado com sucesso para ${req.params.setstatus}`})
            } else{
                res.status(400).send({message: 'Compromisso não encontrado'})
            }
        } catch (error) {
            res.status(400).send({Erro: error.message})
        }
        finally{
            if(client != '')
                client.release()
        }
    },

    async excluir(req, res){
        let client = ''
        try {
            client = await pool.connect()
            let result = await client.query('select * from tb_compromissos where id = $1', [req.params.idcompromisso])
            if(result.rowCount > 0){   
                let sql = 'delete from tb_compromissos where id = $1';
                let dados = [req.params.idcompromisso];
                await client.query(sql, dados);
                res.status(200).send({message: `Compromisso excluido com sucesso`})
            } else{
                res.status(400).send({message: 'Compromisso não encontrado'})
            }
        } catch (error) {
            res.status(400).send({Erro: error.message})
        }
        finally{
            if(client != '')
                client.release()
        }
    }
}