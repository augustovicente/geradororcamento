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
function get_date2(data)
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
    return (year+'-'+month+'-'+dt);
}
function filtrar()
{
    var tipo = document.getElementById("filtro").value;
    var data = document.getElementById("date").value;
    var cliente = document.getElementById("cliente").value;
    if(document.getElementById("filtro").value == 0)
    {
        alert("Escolha um filtro!");
    }
    else if((tipo == 2 && cliente == 0) || (tipo == 1 && data == null))
    {
        alert("Preencha adequadamente os filtros!");
    }
    else
    {
        $.post( "impressao/filtro", 
        {
            tipo: tipo, 
            data: data, 
            cliente: cliente
        }, function(data) 
        {
            var tabela = document.getElementById("table");
            while(tabela.children[1]) 
            {
                tabela.removeChild(tabela.children[1]);
            }
            data.forEach(row => 
            {
                var row_table = document.createElement("tr");
                row_table.id = "row"+document.getElementById("date").value;
                var data = document.createElement("td");
                var cliente = document.createElement("td");
                var qtd = document.createElement("td");
                var preco = document.createElement("td");
                // coluna de status
                var status = document.createElement("td");
                var status_select = document.createElement("select");
                var aprovado = document.createElement("option");
                aprovado.text = "Aprovado";
                aprovado.value = 1;
                var reprovado = document.createElement("option");
                reprovado.text = "Não Aprovado";
                reprovado.value = 2;
                var pendente = document.createElement("option");
                pendente.text = "Pendente";
                pendente.value = 0;
                if(row.status == 0)
                {
                    pendente.selected = true;
                }
                else if(row.status == 1)
                {
                    aprovado.selected = true;                        
                }
                else if(row.status == 2)
                {
                    reprovado.selected = true;                        
                }
                status_select.appendChild(aprovado);
                status_select.appendChild(reprovado);
                status_select.appendChild(pendente);
                status_select.onchange = function () 
                {
                    alterar(row.id_orcamento, this.value);
                };
                status.appendChild(status_select);
                data.innerHTML = get_date(row.data);
                cliente.innerHTML = row.nome;
                qtd.innerHTML = row.total_itens;
                preco.innerHTML = transform_to_preco(row.valor_total);
                row_table.appendChild(data);
                row_table.appendChild(cliente);
                row_table.appendChild(qtd);
                row_table.appendChild(preco);
                row_table.appendChild(status);
                table.appendChild(row_table);
            });
        });
    }
}
function troca_filtro()
{
    if(document.getElementById("filtro").value == 1)
    {
        document.getElementById("date").className = "input1 teste2";
        document.getElementById("cliente").className = "input1 teste";
    }
    else if(document.getElementById("filtro").value == 2)
    {
        document.getElementById("cliente").className = "input1 teste2";
        document.getElementById("date").className = "input1 teste";
    }
}
function transform_to_preco(preco)
{
    var strPreco = "R$ " + parseFloat(preco).toFixed(2).toString().replace(".", ",");
    // retornando o resultado
    return strPreco;
}
function alterar(id, value)
{
    $.post("status/altera", 
    {
        status: value, 
        id: id
    }, function(data) 
    {
        if(data.response == true)
        {
            alert("Alterado!");
        }
    });
}