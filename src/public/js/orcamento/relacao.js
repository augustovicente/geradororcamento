function get_mes(data)
{
    year = data.substring(6, 11);
    month = data.substring(3, 5);
    return year+'-'+month;
}
function get_ano(data)
{
    year = data.substring(6, 11);
    return year;
}
function get_ano2(data)
{
    year = data.substring(0, 4);
    return year;
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
    return (year+'-'+month);
}
function filtrar()
{
    var tipo = document.getElementById("filtro").value;
    var data = document.getElementById("date").value;
    if(document.getElementById("filtro").value == 0)
    {
        alert("Escolha um filtro!");
    }
    else if(data == null)
    {
        alert("Preencha adequadamente os filtros!");
    }
    else
    {
        $.post("relacao/filtro", 
        {
            tipo: tipo, 
            data: data
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
                status_select.disabled = true;
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
                tabela.appendChild(row_table);
            });
        });
    }
}
function transform_to_preco(preco)
{
    var strPreco = "R$ " + parseFloat(preco).toFixed(2).toString().replace(".", ",");
    // retornando o resultado
    return strPreco;
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