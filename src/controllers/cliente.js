const cliente = {};
// ------------- cadastro do cliente -----------
cliente.main = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT nome, codigo as id, cpfcnpj FROM cliente", (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					// receiving sessions
					var message = (req.session.type == 0) ? "Cadastrado com sucesso!" : (req.session.type == 1 ? "Alterado com sucesso!" : "Deletado com sucesso!");
					var confirm = req.session.confirm;
					// cleaning sessions
					req.session.type = null;
					req.session.confirm = false;
					// redirecionando
					res.render('pages/cliente/clientes', 
					{
						data: rows,
						confirm: confirm ? true : false,
						message: message
					})
				}
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
// paginas
cliente.altera_page = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			const { id } = req.params;
			conn.query("SELECT * FROM cliente where codigo =  ?", [id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				res.render('pages/cliente/altera_cliente',
				{
					data: rows[0]
				})
			});
		});
	}
	else
	{
		res.redirect('../../login');
	}
};
cliente.insere_page = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			res.render('pages/cliente/cadastro_cliente')
		});
	}
	else
	{
		res.redirect('../../login');
	}
};
// ações
cliente.insere = (req, res) => 
{
	if(req.session.logado)
	{
		const data = req.body;
		var data_cadastro = new Date();
		data_cadastro = data_cadastro.toISOString().replace("T", " ").replace("Z", "");
		req.getConnection((err, conn) => 
		{
			conn.query('INSERT INTO cliente set data_registro = "'+data_cadastro+'", ?', data, (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 0;
				res.redirect('/cliente');
			});
		});
	}
	else
	{
		res.redirect('../../../login');
	}
};
cliente.altera = (req, res) => 
{
	if(req.session.logado)
	{
		const data = req.body;
		const { id } = req.params;
		req.getConnection((err, conn) => 
		{
			conn.query('UPDATE cliente set ? where codigo = ?', [data, id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 1;
				res.redirect('/cliente');
			});
		});
	}
	else
	{
		res.redirect('../../login');
	}
};
cliente.exclui = (req, res) => 
{
	if(req.session.logado)
	{
		const { id } = req.params;
		req.getConnection((err, conn) => 
		{
			conn.query('DELETE FROM cliente WHERE codigo = ?', [id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 2;
				res.redirect('/cliente');
			});
		});
	}
	else
	{
		res.redirect('../../login');
	}
};
module.exports = cliente;