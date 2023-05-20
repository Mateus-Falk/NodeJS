const express = require('express')
const router = express.Router()
const contato = require('./contato')
const usuario = require('./usuario')
const compromisso = require('./compromisso')
const mdLogin = require('./middleware/middleware-login')
const mdADM = require('./middleware/middleware-adm')

/**Conjunto de rotas para contato */

router.get('/contato', mdLogin, contato.listar)
router.get('/contato/usuario/:idusuario', contato.listarPorUsuario)
router.get('/contato/:idcontato', contato.listarPorId)
router.post('/contato', mdADM, contato.inserir)
router.put('/contato/:idcontato', contato.alterar)
router.delete('/contato/:idcontato', contato.excluir)

/**Conjunto de rotas para usuario */
router.post('/usuario', usuario.registrar)
router.post('/usuario/login', usuario.login)

/**Conjunto de rotas para compromisso */

router.get('/compromisso', compromisso.listar)
router.get('/compromisso/:idcompromisso', compromisso.listarById)
router.post('/compromisso', compromisso.adicionar)
router.put('/compromisso/:idcompromisso', compromisso.editar)
router.put('/compromisso/:idcompromisso/status/:setstatus', compromisso.editarStatus)
router.delete('/compromisso/:idcompromisso', compromisso.excluir)

module.exports = router