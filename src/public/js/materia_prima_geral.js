function muda_pagina()
{
    if(document.getElementById("lista").value != 0)
    {
        document.location.href = 'geral/alterar/'+document.getElementById("lista").value;
    }
    else
    {
        alert("Selecione algum item!");
    }
}
function verifica()
{
    if(document.getElementById("fornecedor").value != 0)
    {
        return true;
    }
    else
    {
        alert("Selecione um fornecedor!");
        return false;
    }
}