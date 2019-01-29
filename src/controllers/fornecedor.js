const fornecedor = {};
// ------------- cadastro do fornecedor -----------
fornecedor.main = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT nome, codigo as id, cpfcnpj FROM fornecedor", (err, rows) => 
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
					res.render('pages/fornecedor/fornecedores', 
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
fornecedor.altera_page = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			const { id } = req.params;
			conn.query("SELECT * FROM fornecedor where codigo =  ?", [id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				res.render('pages/fornecedor/altera_fornecedor',
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
fornecedor.insere_page = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			res.render('pages/fornecedor/cadastro_fornecedor')
		});
	}
	else
	{
		res.redirect('../../login');
	}
};
// ações
fornecedor.insere = (req, res) => 
{
	if(req.session.logado)
	{
		const data = req.body;
		var data_cadastro = new Date();
		data_cadastro = data_cadastro.toISOString().replace("T", " ").replace("Z", "");
		req.getConnection((err, conn) => 
		{
			conn.query('INSERT INTO fornecedor set data_registro = "'+data_cadastro+'", ?', data, (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 0;
				res.redirect('/fornecedor');
			});
		});
	}
	else
	{
		res.redirect('../../login');
	}
};
fornecedor.altera = (req, res) => 
{
	if(req.session.logado)
	{
		const data = req.body;
		const { id } = req.params;
		req.getConnection((err, conn) => 
		{
			conn.query('UPDATE fornecedor set ? where codigo = ?', [data, id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 1;
				res.redirect('/fornecedor');
			});
		});
	}
	else
	{
		res.redirect('../../login');
	}
};
fornecedor.exclui = (req, res) => 
{
	if(req.session.logado)
	{
		const { id } = req.params;
		req.getConnection((err, conn) => 
		{
			conn.query('DELETE FROM fornecedor WHERE codigo = ?', [id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 2;
				res.redirect('/fornecedor');
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
module.exports = fornecedor;