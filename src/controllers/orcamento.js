var PDFDocument = require('pdfkit2');
const orcamento = {};
function get_date(data)
{
    date = new Date(data);
    year = date.getFullYear();
    month = date.getMonth()+1;
    dt = date.getDate();
    hr = date.getHours();
    min = date.getMinutes();
    if (dt < 10) 
    {
        dt = '0' + dt;
    }
    if (month < 10) 
    {
        month = '0' + month; 
	} 
	if (hr < 10) 
    {
        hr = '0' + hr; 
	}
	if (min < 10) 
    {
        min = '0' + min; 
    }
    return (dt+'/'+month+'/'+year+" "+hr+":"+min);
}
function transform_to_preco(preco)
{
    var strPreco = "R$ " + parseFloat(preco).toFixed(2).toString().replace(".", ",");
    // retornando o resultado
    return strPreco;
}
// ------------- controle de orcamento -----------
orcamento.main = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			res.render('pages/orcamento/orcamento');
		});
	}
	else
	{
		res.redirect('../login');
	}
};
orcamento.relacao = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			res.render('pages/orcamento/relacao');
		});
	}
	else
	{
		res.redirect('../login');
	}
};
orcamento.novo = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT * FROM materia_prima", (err, mp) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					conn.query("SELECT nome, codigo as id, cpfcnpj FROM cliente", (err, clientes) => 
					{
						if(err) 
						{
							res.json(err);
						}
						else
						{
							// redirecionando
							res.render('pages/orcamento/novo', 
							{
								materia_prima: mp,
								cliente: clientes
							});
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
orcamento.salva = (req, res) => 
{
	if(req.session.logado)
	{
		const orcamento = req.body;
		const produtos = JSON.parse(req.params.produtos);
		const info = req.params.info;
		req.getConnection((err, conn) => 
		{
			conn.query('INSERT INTO orcamento set total_itens = ?, valor_total = ?, data = now(), status = 0, ?', [produtos.length, info, orcamento], (err, rows) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					conn.query('SELECT last_insert_id() as id', (err, id_orcamento) => 
					{
						var dir1, dir2 = "";
						if(req.files.imagem1)
						{
							let img1 = req.files.imagem1;
							dir1 = 'src/public/img-orc/'+id_orcamento[0].id+'-img1.jpg';
							img1.mv(dir1, function(err) {});
						}
						if(req.files.imagem2)
						{
							let img2 = req.files.imagem2;
							dir2 = 'src/public/img-orc/'+id_orcamento[0].id+'-img2.jpg';
							img2.mv(dir2, function(err) {});
						}
						conn.query('UPDATE orcamento set imagem1 = ?, imagem2 = ? where codigo = ?', [dir1 , dir2, id_orcamento[0].id], (err, rows) => 
						{
							if(err) 
							{
								res.json(err);
							}
							else
							{
								if(err)
								{
									res.json(err);
								}
								else
								{
									var timer = 0;
									for(let produto of produtos)
									{
										setTimeout(() => 
										{
											conn.query('INSERT INTO produto_orcamento set codigo_or = ?, nome = ?, especificacao = ?', [id_orcamento[0].id, produto[0], produto[3]], (err, rows) =>
											{
												if(err) 
												{
													res.json(err);
												}
												else
												{
													conn.query('SELECT last_insert_id() as id', (err, id_produto) =>
													{
														if(err) 
														{
															res.json(err);
														}
														else
														{
															for(let mp of produto[2])
															{
																conn.query('INSERT INTO materia_prima_do_produto set codigo_mp = ?, codigo_pr = ?, qtd = ?, intervalo = ?', [mp[0], id_produto[0].id, mp[1], mp[3]], (err, rows) =>
																{
																	if(err)
																	{
																		res.json(err);
																	}
																});
															};
														}
													});
												}
											});
										}, timer);
										timer += 1000;
									};
									setTimeout(() => 
									{
										res.redirect('../../../impressao/pdf/'+id_orcamento[0].id);
									}, timer);
								}
							}
						});
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
orcamento.impressao = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT nome, codigo as id, cpfcnpj FROM cliente", (err, clientes) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					var exclui = (req.session.exclui) ? true : false;
					// cleaning sessions
					req.session.id = null;
					res.render('pages/orcamento/impressao', 
					{
						data: clientes,
						exclui: exclui
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
orcamento.pdf = (req, res) => 
{
	if(req.session.logado)
	{
		var id = req.params.id;
		req.getConnection((err, conn) => 
		{
			conn.query("select * from pdf where id_orcamento = "+id, (err, orcamento) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					conn.query("select pr.nome as nome, pr.codigo as cod, pr.especificacao from produto_orcamento pr where pr.codigo_or = "+id, (err, produtos) => 
					{
						if(err) 
						{
							res.json(err);
						}
						else
						{
							var doc = new PDFDocument({margin: 10});
							let filename = "orcamento"+id;
							filename = encodeURIComponent(filename) + '.pdf';
							res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
							res.setHeader('Content-type', 'application/pdf');
							// cabecalho
							doc.image("src/public/img/Logo.PNG", 15, 0,
							{
								fit: [250, 300]
							});
							doc.fontSize(8).text('Rua Avelino José da Silva, 421 - Jardim Ana Rosa II - Cep: 86.183-773\nTel: (43)3253-5424 / Site: www.produnox.com.br - Cambé - Pr.', 
							285, 30);
							// dados principais do orcamento
							var data = new Date();
							var altura = 90;
							orcamento = orcamento[0];
							doc.fontSize(14).text('Emissão: '+get_date(data.toISOString()), 55, altura);
							doc.fontSize(14).text('Orçamento nº: '+id, 270, altura);
							altura += 20;
							doc.fontSize(10).text('Cliente: '+orcamento.nome, 55, altura);
							altura += 15;
							doc.fontSize(10).text('E-mail: '+orcamento.email, 55, altura);
							altura += 15;
							doc.fontSize(10).text('Endereço: '+orcamento.endereco, 55, altura);
							altura += 15;
							// altura += 15;
							doc.fontSize(10).text('Tel: '+ orcamento.telefone, 55, altura);
							altura += 15;
							doc.fontSize(10).text('Prazo de entrega: '+ orcamento.prazo, 55, altura);
							altura += 20;
							doc.moveTo(0, altura).lineTo(700, altura).stroke();
							// produtos do orçamento
							produtos.forEach(produto => 
							{
								conn.query("select * from pdf_materia_prima_produtos where produto = "+produto.cod, (err, materia_prima) => 
								{
									if(err) 
									{
										res.json(err);
									}
									else
									{	
										altura += 15;
										doc.fontSize(12).text('Produto: '+produto.nome, 55, altura);
										altura += 15;
										doc.fontSize(11).text('Especificação: '+produto.especificacao, 55, altura);
										materia_prima.forEach(row => 
										{
											altura += 15;
											if(row.especifica == 0)
											{
												if(altura >= 680 && altura < 710)
												{
													altura = 710;
													doc.fontSize(10).text('Nome: '+row.nome, 60, altura);
												}
												else
												{
													doc.fontSize(10).text('Nome: '+row.nome, 60, altura);
												}
											}
											else if(row.especifica == 1)
											{
												if(altura >= 680 && altura < 710)
												{
													altura = 710;
													doc.fontSize(10).text('Nome: '+row.nome, 60, altura);
													var qtd_mp = parseFloat(row.qtd);
													var intervalo = parseFloat(row.intervalo);
													var resto = ((qtd_mp/intervalo) % 2) == 0 ? 1 : 2;
													var final = row.intervalo_final == 0 ? parseInt((qtd_mp/intervalo)+resto) : row.intervalo_final; 
													doc.fontSize(10).text(final+" "+row.demarcacao.substring(0, 10), 470, altura);
												}
												else
												{
													doc.fontSize(10).text('Nome: '+row.nome, 60, altura);
													var qtd_mp = parseFloat(row.qtd);
													var intervalo = parseFloat(row.intervalo);
													var resto = ((qtd_mp/intervalo) % 2) == 0 ? 1 : 2;
													var final = row.intervalo_final == 0 ? parseInt((qtd_mp/intervalo)+resto) : row.intervalo_final; 
													doc.fontSize(10).text(final+" "+row.demarcacao.substring(0, 10), 470, altura);
												}
											}
										});
									}
								});
							});
							setTimeout(() => 
							{
								var obs = altura +30;
								if(orcamento.imagem1 != "" && orcamento.imagem1 != undefined && orcamento.imagem1 != null)
								{
									doc.image(orcamento.imagem1, 40, altura+30, 
									{
										fit: [250, 200]
									});
									obs = (altura + 30) + 200 + 10;
								}
								if(orcamento.imagem2 != "" && orcamento.imagem2 != undefined && orcamento.imagem2 != null)
								{
									doc.image(orcamento.imagem2, 295, altura+30,
									{
										fit: [250, 200]
									});
									obs = (altura + 30) + 200 + 10;
								}
								if(orcamento.observacao != "" && orcamento.observacao != undefined && orcamento.observacao != null)
								{
									doc.fontSize(8).text('Observação: ', 55, obs);
									var texts = orcamento.observacao.split(/\r?\n/g);
									texts.forEach(text => 
									{
										doc.moveDown();
										doc.fontSize(8).text(text);
									});
									doc.fontSize(10).text('Valor Total: '+transform_to_preco(orcamento.valor_total));
									doc.moveDown();
									doc.fontSize(8).text('Forma de pagamento: '+orcamento.forma_pagamento);
								}
								doc.moveDown();
								doc.fontSize(8).text('ATT. Emerson Santos', {align:"right"});
								doc.moveDown();
								doc.fontSize(8).text('(43)3253-5424/9808-0106', {align:"right"});
							}, 3000);
							// finalizando
							setTimeout(() => 
							{
								doc.pipe(res);
								doc.end()
							}, 5000);
						}
					});
				}
			});
		});
	}
	else
	{
		res.redirect('../../../login');
	}
};
orcamento.filtro = (req, res) => 
{
	if(req.session.logado)
	{
		var dados = req.body;
		var condition = (dados.tipo == 1) ? ("date(data) = '"+dados.data+"'").toString() : ("id_cliente = "+dados.cliente).toString();
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT * FROM resumo WHERE "+ condition, (err, orcamentos) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					res.json(orcamentos);
				}
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
orcamento.filtro_relacao = (req, res) => 
{
	if(req.session.logado)
	{
		var dados = req.body;
		var condition = (dados.tipo == 1) ? ("month(data) = month('"+dados.data+"-01') and year(data) = year('"+dados.data+"-01')").toString() : ("year(data) = year('"+dados.data+"-01')").toString();
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT * FROM resumo WHERE "+ condition, (err, orcamentos) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					res.json(orcamentos);
				}
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
};
orcamento.excluir = (req, res) => 
{
	if(req.session.logado)
	{
		var id = req.params.id;
		req.getConnection((err, conn) => 
		{
			conn.query("delete from orcamento where codigo = "+id, (err, orcamentos) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					conn.query("delete from produto_orcamento where codigo_or = "+id, (err, orcamentos) =>
					{
						if(err) 
						{
							res.json(err);
						}
						else
						{
							req.session.exclui = true;
							res.redirect('../impressao');
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
orcamento.status = (req, res) => 
{
	if(req.session.logado)
	{
		req.getConnection((err, conn) => 
		{
			conn.query("SELECT nome, codigo as id, cpfcnpj FROM cliente", (err, clientes) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					res.render('pages/orcamento/status', 
					{
						data: clientes
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
orcamento.altera_status = (req, res) => 
{
	if(req.session.logado)
	{
		const info = req.body;
		req.getConnection((err, conn) => 
		{
			conn.query("update orcamento set status = "+info.status+" where codigo = "+info.id, (err, mp) => 
			{
				if(err) 
				{
					res.json(err);
				}
				else
				{
					// redirecionando
					res.json({ response : true });
				}
			});
		});
	}
	else
	{
		res.redirect('../login');
	}
}
module.exports = orcamento;