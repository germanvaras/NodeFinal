const handle404 = (req, res) => {
    res.status(404).render('404', { title: "Página no encontrada", url: req.url, user:req?.session?.user, style:"index.css" });
};
module.exports = handle404;
