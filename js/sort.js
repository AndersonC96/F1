window.addEventListener('DOMContentLoaded', function (){// carregamento da página
    var form = document.getElementById('sorting-form');// obtém o formulário
    form.addEventListener('change', function (){// quando o formulário é alterado
        form.submit();// submete o formulário
    });
});