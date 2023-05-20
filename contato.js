const pool = require('./conexao')
const userLogado = require('./libraries/getUserLogado')

module.exports = {
    async listar(req, res) {
        let client = '';
        try {
            client = await pool.connect();
            let listaContatos = '';
            if(userLogado.user(req).perfil === 'ADM')
                listaContatos = await client.query('select * from tb_contatos');
            else{
                listaContatos = await client.query('select * from tb_contatos where idcontato = $1', [userLogado.user(req).id]);
            }
                
            res.status(200).send(listaContatos.rows)
                       
        } catch (error) {
            res.status(400).send({Error: error.message}) 
        }
        finally{
            if(client != '')
                client.release();
        }     
        
    },
    async listarPorUsuario(req, res){
        let client = '';
        try {
            client = await pool.connect();
            let listaContatos = await client.query('select * from tb_contatos where idcontato = $1', [req.params.idusuario]);
            res.status(200).send(listaContatos.rows)
        } catch (error) {
            res.status(400).send({Error: error.message}) 
        }
        finally{
            if(client != '')
                client.release();
        }
    },
    listarPorId(req, res) {
       pool.connect((err, client)=>{
          if(err){
             return res.send(`Erro de conexão: ${err.message}`)
          }
 
          client.query('select * from tb_contatos where id = $1',[req.params.idcontato],(err, result) => {
             if(err){
                return res.send(`Erro de conexão: ${err.message}`)
             }
             
             res.status(200).send(result.rows[0])
          })       
          client.release()  
       })  
         
    },
   async inserir(req, res){
     /*pool.connect((err, client)=>{
       if(err){
          return res.send(`Erro: ${err.message}`)
          }
       let sql = "insert into tb_contatos(nome, email, celular) values($1,$2,$3)"
       let dados = [req.body.nome, req.body.email, req.body.celular]
       client.query(sql,dados,(err, result) => {
          if(err){
             return res.send(`Erro: ${err.message}`)
          }
          
          res.status(200).send({ message: `contato cadastrado com sucesso ${result}`})
       })
       })   */
       let client = ''; 
       try {
           client = await pool.connect();       
           let result = await client.query('select * from tb_contatos where email = $1',[req.body.email])
           if(result.rowCount > 0)
             return res.status(400).send({ message: "Já existe um contato com esse email"})
         
           let sql = "insert into tb_contatos(nome, email, celular, idcontato) values($1,$2,$3,$4)"
           let dados = [req.body.nome, req.body.email, req.body.celular, userLogado.user(req).id]
           result = await client.query(sql, dados)
            //client.release()
           res.status(201).send({ message: "Contato inserido com sucesso"})
       } catch (error) {
            res.status(400).send({Error: error.message})
       }
       finally{
        if(client != '')
            client.release();
        }
    },
    async alterar(req, res){
        let client = '';
        try {
            client = await pool.connect()
            let result = await client.query(`select * from tb_contatos where id = $1`, [req.params.idcontato])
            let verificaEmail = await client.query('select * from tb_contatos where email = $1', [req.body.email])
            if(verificaEmail.rowCount > 0 && verificaEmail.rows[0].id != req.params.idcontato)
                return res.status(400).send({message: "Já existe um contato com esse email"});
            
            if(result.rowCount > 0){
                let sql = "update tb_contatos set nome = $1, email = $2, celular = $3, idcontato = $4 where id = $5";
                let dados = [req.body.nome, req.body.email, req.body.celular,req.body.idcontato,req.params.idcontato]
                    
                await client.query(sql,dados) 
               // client.release();                                    
                res.status(200).send({message: `Contato atualizado com sucesso`, contato: req.body}) 
            } else{
                return res.status(400).send({message: "O contato não existe"})    
            }
            //client.release();
        } catch (error) {
            res.status(400).send({Error: error.message})
        }
        finally{
            if(client != '')
                client.release();
        }
    },
    async excluir(req, res){
        let client = '';
        try {
            client = await pool.connect()
            let result = await client.query(`select * from tb_contatos where id = $1`, [req.params.idcontato])
            if(result.rowCount > 0){

                let sql = "delete from tb_contatos where id = $1";
                let dados = [req.params.idcontato]
                
                await client.query(sql,dados)
                
                res.status(200).send({message: `Contato excluido com sucesso ${req.params.idcontato}`})
                
                //client.release()
            } else{
                return res.status(400).send({message: "O contato não existe"})
            }    
           // client.release();
        } catch (error) {
            res.status(400).send({Error: error.message})
        }
        finally{
            if(client != '')
                client.release();
        }

    }
 }