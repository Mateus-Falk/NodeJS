module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || '';
    if(token === '')
        return res.status(401).send({message: 'Precisa estar logado para consultar contatos'});
    else
        next()   
}