$(document).keyup(function(e) 
{
    if (e.keyCode === 27)
    {
        $('.div_voltar')[0].click();
    }
});
function faz_filtro(id_select, id_filtro)
{
    // You could use it like this:
    $(function() 
    {
        $(id_select).filterByText($(id_filtro));
    }); 
    jQuery.fn.filterByText = function(textbox) 
    {
        return this.each(function() 
        {
            var select = this;
            var options = [];
            $(select).find('option').each(function() 
            {
                options.push({value: $(this).val(), text: $(this).text()});
            });
            $(select).data('options', options);
            $(textbox).bind('change keyup', function() 
            {
                var options = $(select).empty().scrollTop(0).data('options');
                var search = $(this).val().trim();
                var regex = new RegExp(search,"gi");
                $.each(options, function(i) 
                {
                    var option = options[i];
                    if(option.text.match(regex) !== null) 
                    {
                        $(select).append(
                        $('<option>').text(option.text).val(option.value)
                        );
                    }
                });
            });            
        });
    };
}