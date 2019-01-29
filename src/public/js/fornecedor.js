function muda_pagina()
{
    if(document.getElementById("lista").value != 0)
    {
        document.location.href = 'fornecedor/alterar/'+document.getElementById("lista").value;
    }
    else
    {
        alert("Selecione algum item!");
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
    return (year+'-'+month+'-'+dt);
}