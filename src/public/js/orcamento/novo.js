$("#lista").change(function () 
{
    var mp = $(this);
    var v_u = mp.find(':selected').data('price');
    $('#preco_custo').val("Preço de custo: "+transform_to_preco(v_u));
});
function lista()
{
    var select1 = document.getElementById("lista_produto");
    if(sessionStorage.getItem('orcamentos'))
    {
        var produtos = JSON.parse(sessionStorage.getItem('orcamentos'));
        produtos.forEach(produto =>
        {
            var option = document.createElement("option");
            option.text = produto[0];
            option.value = JSON.stringify(produto);
            select1.appendChild(option);
        });   
    }
}
function adicionar()
{
    if(document.getElementById("lista").value == 0)
    {
        alert("Selecione a matéria prima!");
    }
    else if(document.getElementById("margem_lucro").value == undefined || document.getElementById("margem_lucro").value == "" || document.getElementById("margem_lucro").value == null)
    {
        alert("Informe a margem de lucro!");
    }
    else if(document.getElementById("qtd").value == undefined || document.getElementById("qtd").value == "" || document.getElementById("qtd").value == null)
    {
        alert("Informe a quantidade!");        
    }
    else if(document.getElementById("lista_produto").value == 0)
    {
        alert("Selecione o produto!");        
    }
    else
    {
        if(sessionStorage.getItem('orcamentos'))
        {
            if(sessionStorage.getItem('orcamentos') != undefined && sessionStorage.getItem('orcamentos') != "" && sessionStorage.getItem('orcamentos') != "null")
            {
                var produtos = JSON.parse(sessionStorage.getItem('orcamentos'));
                var produto = JSON.parse(document.getElementById("lista_produto").value);
                var index = findIndex(JSON.parse(sessionStorage.getItem('orcamentos')), JSON.parse(document.getElementById("lista_produto").value));
                var materia_prima = [document.getElementById("lista").value, document.getElementById("qtd").value, document.getElementById("margem_lucro").value];
                produto[2].push(materia_prima);
                produtos[index] = produto;
                sessionStorage.setItem("orcamentos", JSON.stringify(produtos));
                window.location.reload();
            }
            else
            {
                var produtos = JSON.parse(sessionStorage.getItem('orcamentos'));
                var produto = JSON.parse(document.getElementById("lista_produto").value);
                var index = findIndex(JSON.parse(sessionStorage.getItem('orcamentos')), JSON.parse(document.getElementById("lista_produto").value));
                var materia_prima = [document.getElementById("lista").value, document.getElementById("qtd").value, document.getElementById("margem_lucro").value];
                produto[2].push(materia_prima);
                produtos[index] = produto;
                sessionStorage.setItem("orcamentos", JSON.stringify(produtos));
                window.location.reload();
            }
        }
        else
        {
            var produtos = JSON.parse(sessionStorage.getItem('orcamentos'));
            var produto = JSON.parse(document.getElementById("lista_produto").value);
            var index = findIndex(JSON.parse(sessionStorage.getItem('orcamentos')), JSON.parse(document.getElementById("lista_produto").value));
            var materia_prima = [document.getElementById("lista").value, document.getElementById("qtd").value, document.getElementById("margem_lucro").value];
            produto[2].push(materia_prima);
            produtos[index] = produto;
            sessionStorage.setItem("orcamentos", JSON.stringify(produtos));
            window.location.reload();
        }
    }
}
function adicionar_produto()
{
    if(document.getElementById("nome_produto").value == "")
    {
        alert("Preencha o nome do produto!");
    }
    else
    {
        if(sessionStorage.getItem('orcamentos'))
        {
            if(sessionStorage.getItem('orcamentos') != undefined && sessionStorage.getItem('orcamentos') != "" && sessionStorage.getItem('orcamentos') != "null")
            {
                var orcamentos = JSON.parse(sessionStorage.getItem('orcamentos'));
                var orcamento = [document.getElementById("nome_produto").value, orcamentos.length, []];
                orcamentos.push(orcamento);
                sessionStorage.setItem("orcamentos", JSON.stringify(orcamentos));
                window.location.reload();
            }
            else
            {
                var orcamentos = [];
                var orcamento = [document.getElementById("nome_produto").value, orcamentos.length, []];
                orcamentos.push(orcamento);
                sessionStorage.setItem("orcamentos", JSON.stringify(orcamentos));
                window.location.reload();    
            }
        }
        else
        {
            var orcamentos = [];
            var orcamento = [document.getElementById("nome_produto").value, orcamentos.length, []];
            orcamentos.push(orcamento);
            sessionStorage.setItem("orcamentos", JSON.stringify(orcamentos));
            window.location.reload();
        }
    }
}
function carregar(dados)
{
    if(sessionStorage.getItem('orcamentos'))
    {
        if(sessionStorage.getItem('orcamentos') != undefined && sessionStorage.getItem('orcamentos') != "" && sessionStorage.getItem('orcamentos') != "null")
        {
            var table = document.getElementById("table");
            var orcamentos = JSON.parse(sessionStorage.getItem('orcamentos'));
            var orcamentos_bu = JSON.parse(sessionStorage.getItem('orcamentos'));
            var valor_final = 0;
            document.getElementById("total_itens").innerHTML = orcamentos.length;
            orcamentos.forEach((orcamento, io) => 
            {
                var valor_produto = 0;
                var orcamento_bu = orcamentos_bu[io];
                // nome do produto
                var produto = document.createElement("td");
                produto.innerHTML = orcamento[0];
                // sub total do produo
                var sub_total = document.createElement("td");
                sub_total.id = "produto"+orcamento[1]+"st";
                // coluna de remover
                var remover = document.createElement("td");
                remover.innerHTML = "REMOVER";
                remover.className = "remove";
                remover.onclick = function () 
                {
                    remover_item(orcamento, this);
                };
                //row do produto
                var row_table = document.createElement("tr");
                row_table.id = "produto"+orcamento[1];
                row_table.appendChild(produto);
                row_table.appendChild(sub_total);
                row_table.appendChild(remover);
                // adicionado à tabela
                table.appendChild(row_table);
                var last_row = document.getElementById("produto"+orcamento[1]);
                // cada materia prima do produto
                var cont = 0;
                orcamento[2].forEach(mp => 
                {
                    var materiaprima = JSON.parse(JSON.stringify(mp));
                    var margem = document.createElement("td");
                    var demarcacao = document.createElement("td");
                    var materia_prima = document.createElement("td");
                    var qtd = document.createElement("td");
                    var preco = document.createElement("td");
                    var remover = document.createElement("td");
                    dados.forEach(row => 
                    {
                        if(row.codigo == mp[0])
                        {
                            if(row.especifica == 0)
                            {
                                // recebendo dados
                                materiaprima.push(row.nome);
                                materiaprima.push(row.valor_unitario);
                                materiaprima.push(row.unidade);
                                materiaprima.push(row.marca);
                                // valor final tratado
                                valor_final += (parseFloat(materiaprima[1])*parseFloat(materiaprima[4]))+(parseFloat(materiaprima[1])*
                                                parseFloat(materiaprima[4])*parseFloat(materiaprima[2]));
                                valor_produto += (parseFloat(materiaprima[1])*parseFloat(materiaprima[4]))+(parseFloat(materiaprima[1])*
                                                parseFloat(materiaprima[4])*parseFloat(materiaprima[2]));
                                // nome da materia prima tratado
                                materia_prima.innerHTML = materiaprima[3]+" ("+materiaprima[6]+")";
                                // quantidade de materia prima adicionada 
                                qtd.innerHTML = materiaprima[1];
                                // preço da materia prima
                                preco.innerHTML = transform_to_preco((parseFloat(materiaprima[1])*parseFloat(materiaprima[4]))+(parseFloat(materiaprima[1])*
                                                parseFloat(materiaprima[4])*parseFloat(materiaprima[2])));
                                // coluna de remover
                                remover.innerHTML = "REMOVER";
                                remover.className = "remove"
                                remover.onclick = function () 
                                {
                                    var index = findIndex(orcamento_bu[2], materiaprima.slice(0, 3));
                                    orcamento_bu[2][index] = orcamento_bu[2][index].slice(0, 3);
                                    remover_item_mp(materia_prima, orcamento_bu);
                                };
                                // row de materia prima
                                var row_table2 = document.createElement("tr");
                                row_table2.id = "mp"+materiaprima[0];
                                row_table2.appendChild(margem);
                                row_table2.appendChild(materia_prima);
                                row_table2.appendChild(qtd);
                                row_table2.appendChild(preco);
                                row_table2.appendChild(demarcacao);
                                row_table2.appendChild(remover);
                                // adicionado à tabela
                                last_row.parentNode.insertBefore(row_table2, last_row.nextSibling);
                                last_row = document.getElementById("mp"+materiaprima[0]);
                                cont++;
                                document.getElementById("produto"+orcamento[1]+"st").innerHTML = "Subtotal: "+transform_to_preco(valor_final);
                                document.getElementById("valor_total").innerHTML = transform_to_preco(valor_final);
                            }
                            else if(row.especifica == 1)
                            {
                                // recebendo dados
                                materiaprima.push(row.nome);
                                materiaprima.push(row.valor_unitario);
                                materiaprima.push(row.unidade);
                                materiaprima.push(row.marca);
                                materiaprima.push(row.intervalo);
                                materiaprima.push(row.demarcacao);
                                // valor final tratado
                                valor_final += (parseFloat(materiaprima[1])*parseFloat(materiaprima[4]))+(parseFloat(materiaprima[1])*
                                                parseFloat(materiaprima[4])*parseFloat(materiaprima[2]));
                                // nome da materia prima tratado
                                materia_prima.innerHTML = materiaprima[3]+" ("+materiaprima[6]+")";
                                // quantidade de materia prima adicionada 
                                qtd.innerHTML = materiaprima[1];
                                // preço da materia prima
                                preco.innerHTML = transform_to_preco((parseFloat(materiaprima[1])*parseFloat(materiaprima[4]))+(parseFloat(materiaprima[1])*
                                                parseFloat(materiaprima[4])*parseFloat(materiaprima[2])));
                                // especificade da materia prima
                                demarcacao.innerHTML = parseInt((parseFloat(materiaprima[1])/parseFloat(materiaprima[7])+1))+" "+materiaprima[8];
                                // coluna de remover
                                remover.innerHTML = "REMOVER";
                                remover.className = "remove";
                                remover.onclick = function () 
                                {
                                    var orcamento_modificado = JSON.parse(JSON.stringify(orcamento));
                                    orcamento_modificado[2][0] = orcamento_modificado[2][0].slice(0, 3);
                                    remover_item_mp(materia_prima, orcamento_modificado);
                                };
                                // row de materia prima
                                var row_table2 = document.createElement("tr");
                                row_table2.id = "mp"+materiaprima[0];
                                row_table2.appendChild(margem);
                                row_table2.appendChild(materia_prima);
                                row_table2.appendChild(qtd);
                                row_table2.appendChild(preco);
                                row_table2.appendChild(demarcacao);
                                row_table2.appendChild(remover);
                                // adicionado à tabela
                                last_row.parentNode.insertBefore(row_table2, last_row.nextSibling);
                                document.getElementById("produto"+orcamento[1]+"st").innerHTML = "Subtotal: "+transform_to_preco(valor_final);
                                document.getElementById("valor_total").innerHTML = transform_to_preco(valor_final);
                            }
                        }
                    });
                });
            });
            sessionStorage.setItem("orcamentos", JSON.stringify(orcamentos));
        }
        else
        {
            document.getElementById("total_itens").innerHTML = 0;
            document.getElementById("valor_total").innerHTML = transform_to_preco(0);    
        }
    }
    else
    {
        document.getElementById("total_itens").innerHTML = 0;
        document.getElementById("valor_total").innerHTML = transform_to_preco(0);
    }
}
function transform_to_preco(preco)
{
    var strPreco = "R$ " + parseFloat(preco).toFixed(2).toString().replace(".", ",");
    // retornando o resultado
    return strPreco;
}
function transform_to_num(preco)
{
    var strPreco = preco.replace("R$ ", "");
    strPreco = strPreco.replace(",",".");
    strPreco = parseInt(strPreco);
    // retornando o resultado
    return strPreco;
}
function remover_item(orcamento, context)
{
    var orcamentos_novo = JSON.parse(sessionStorage.getItem('orcamentos'));
    var index = findIndex(orcamentos_novo, orcamento);
    orcamentos_novo.splice(index, 1);
    orcamentos_novo.forEach((orcamento, i)=>
    {
        orcamento[1] = i; 
    });
    sessionStorage.setItem("orcamentos", JSON.stringify(orcamentos_novo));
    window.location.reload();
}
function remover_item_mp(mp, orcamento)
{
    var orcamentos_novo = JSON.parse(sessionStorage.getItem('orcamentos'));
    var index = findIndex(orcamentos_novo, orcamento);
    var index2 = findIndex(orcamentos_novo[index][2], mp);
    orcamentos_novo[index][2].splice(index2, 1);
    sessionStorage.setItem("orcamentos", JSON.stringify(orcamentos_novo));
    window.location.reload();
}
function salvar()
{
    if(document.getElementById("cliente").value == 0)
    {
        alert("Escolha um cliente!");
        return false;
    }
    else
    {
        $('#form1').attr('action', 'novo/salvar/'+sessionStorage.getItem('orcamentos')+'/'+transform_to_num(document.getElementById("valor_total").innerHTML));
        return true;
    }
}
function get_date(data)
{
    date = new Date(data);
    year = date.getFullYear();
    month = date.getMonth()+1;
    dt = date.getDate();
    if (dt < 10) 
    {
        dt = '0' + dt;
    }
    if (month < 10) 
    {
        month = '0' + month; 
    }
    return (dt+'/'+month+'/'+year);
}
function findIndex(arr, val_out)
{
    var result = -1;
    arr.forEach((val, i)=>
    {
        if(JSON.stringify(val) == JSON.stringify(val_out))
        {
            result = i;
        }
    });
    return result;
}