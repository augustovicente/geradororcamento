const materia_prima = {};
// ------------- cadastro de materia prima -----------
materia_prima.main = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			res.render('pages/materia_prima/materia_prima');
		});
	}
	else
	{
		res.redirect('../login');
	}
};
materia_prima.submain_especifica = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT nome, codigo as id, marca FROM materia_prima where especifica = 1", (err, rows) => 
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
					res.render('pages/materia_prima/materia_prima_especifica/materia_prima', 
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
materia_prima.submain_geral = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT nome, codigo as id, marca FROM materia_prima where especifica = 0", (err, rows) => 
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
					res.render('pages/materia_prima/materia_prima/materia_prima', 
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
// paginas - geral
materia_prima.insere_geral_page = (req, res) => 
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
					// redirecionando
					res.render('pages/materia_prima/materia_prima/cadastro_materia_prima', 
					{
						data: rows
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
materia_prima.altera_geral_page = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			const { id } = req.params;
			conn.query("SELECT * FROM materia_prima where codigo = ?", [id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					conn.query("SELECT nome, codigo as id, cpfcnpj FROM fornecedor", (err, fornecedores) => 
					{
						if(err) 
						{
							res.json(err);
						}
						else
						{
							// redirecionando
							res.render('pages/materia_prima/materia_prima/altera_materia_prima', 
							{
								data: rows[0],
								fornecedores: fornecedores
							})
						}
					});
				}
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
// paginas - especifica
materia_prima.insere_especifica_page = (req, res) => 
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
					// redirecionando
					res.render('pages/materia_prima/materia_prima_especifica/cadastro_materia_prima', 
					{
						data: rows
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
materia_prima.altera_especifica_page = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			const { id } = req.params;
			conn.query("SELECT * FROM materia_prima where codigo = ?", [id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					conn.query("SELECT nome, codigo as id, cpfcnpj FROM fornecedor", (err, fornecedores) => 
					{
						if(err) 
						{
							res.json(err);
						}
						else
						{
							// redirecionando
							res.render('pages/materia_prima/materia_prima_especifica/altera_materia_prima', 
							{
								data: rows[0],
								fornecedores: fornecedores
							})
						}
					});
				}
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
// ações - geral
materia_prima.insere_geral = (req, res) =>
{
	if(req.session.logado)
	{
		const data = req.body;
		req.getConnection((err, conn) =>
		{
			conn.query('INSERT INTO materia_prima set especifica = 0, ?', data, (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 0;
				res.redirect('/materia_prima/geral');
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
materia_prima.altera_geral = (req, res) => 
{
	if(req.session.logado)
	{
		const data = req.body;
		const { id } = req.params;
		req.getConnection((err, conn) => 
		{
			conn.query('UPDATE materia_prima set ? where codigo = ?', [data, id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					req.session.confirm = true;
					req.session.type = 1;
					res.redirect('/materia_prima/geral');
				}
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
materia_prima.exclui_geral = (req, res) => 
{
	if(req.session.logado)
	{
		const { id } = req.params;
		req.getConnection((err, conn) => 
		{
			conn.query('DELETE FROM materia_prima WHERE codigo = ?', [id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 2;
				res.redirect('/materia_prima/geral');
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
// ações - especifica
materia_prima.insere_especifica = (req, res) =>
{

	if(req.session.logado)
	{
		const data = req.body;
		req.getConnection((err, conn) =>
		{
			conn.query('INSERT INTO materia_prima set especifica = 1, ?', data, (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 0;
				res.redirect('/materia_prima/especifica');
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
materia_prima.altera_especifica = (req, res) => 
{
	if(req.session.logado)
	{
		const data = req.body;
		const { id } = req.params;
		req.getConnection((err, conn) => 
		{
			conn.query('UPDATE materia_prima set ? where codigo = ?', [data, id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					req.session.confirm = true;
					req.session.type = 1;
					res.redirect('/materia_prima/especifica');
				}
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
materia_prima.exclui_especifica = (req, res) => 
{
	if(req.session.logado)
	{
		const { id } = req.params;
		req.getConnection((err, conn) => 
		{
			conn.query('DELETE FROM materia_prima WHERE codigo = ?', [id], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				req.session.confirm = true;
				req.session.type = 2;
				res.redirect('/materia_prima/especifica');
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
module.exports = materia_prima;