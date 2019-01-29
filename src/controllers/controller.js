const controller = {};
// index
controller.index = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			res.render('index');
		});
	}
	else
	{
		res.redirect('login');
	}
};
// login
controller.login = (req, res) => 
{
	req.getConnection((err, conn) => 
	{
		res.render('login',{erro:false});
	});
};
// logar
controller.logar = (req, res) => 
{
	const login = req.body.user;
	const senha = req.body.pwd;
	req.getConnection((err, conn) => 
	{
		if(senha === "isabM3t@is" && login === "produnox@hotmail.com")
		{
			req.session.logado = true;
			res.redirect('/');
		}
		else
		{
			req.getConnection((err, conn) => 
			{
				res.render('login',{erro:true});
			});
		}
	});
};
module.exports = controller;
