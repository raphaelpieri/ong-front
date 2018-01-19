var _row = null;
function listarOngs(){
    if ($("#tabela tbody").length === 0){
        $("#tabela").append('<tbody></tbody>');
    }

    var tabOngs = returnToLocalStorage("tabela-ong");
    if(tabOngs !== null){
        for(var i = 0; i < tabOngs.length; i++){
            var html = tabOngs[i];
            $("#tabela tbody").append(html);
        }
    }else{
        var tabela = [];
        saveInLocalStorage("tabela-ong", tabela);
    }
}

function salvar() {
    if($("#ong_nome").val() !== null && $("#ong_nome").val() !== ''){
        var objeto = {
            nome: $("#ong_nome").val(),
            slogan: $("#ong_slogan").val(),
            site: $("#ong_site").val(),
            ativo: $("#ong_ativa").is(":checked")
        };
        formClean()
        $.ajax({
            url:'http://localhost:5000/ongs',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(objeto),
            contentType: 'application/json; charset=utf-8',
            success: function (data, textStatus, xhr) {
                var html = data.data.html;
                if(_row !== null){
                    var valores = _row[0].innerHTML;
                    removeToLocalStorage("tabela-ong", valores);
                    _row.remove();
                    _row = null;
                }
                $("#tabela tbody").append(html);
                var tabela = returnToLocalStorage("tabela-ong");
                tabela.push(html);
                saveInLocalStorage("tabela-ong", tabela);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    }
}

function formClean() {
    $("#ong_nome").val("");
    $("#ong_slogan").val("");
    $("#ong_site").val("");
    $("#ong_ativa").prop('checked', true);
}
function saveInLocalStorage(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}

function returnToLocalStorage(key) {
    var retorno = localStorage.getItem(key);
    return JSON.parse(retorno);
}

function removeToLocalStorage(key, value){
    value = "<tr>"+ value +"</tr>"
    var lista = returnToLocalStorage(key);
    var indice = lista.indexOf(value);
    lista.splice(indice, 1);
    saveInLocalStorage(key, lista);
}

function excluirOng(ong) {
    var valores = $(ong).parents('tr')[0].innerHTML;
    removeToLocalStorage("tabela-ong", valores);
    $(ong).parents("tr").remove();
}

function novaOng() {
    $("#tituloForm").html("Inserindo ONG");
}

function atualizarOng(ong) {
    _row = $(ong).parents('tr');
    var cols = _row.children("td");
    $("#ong_nome").val($(cols[0]).text());
    $("#ong_slogan").val($(cols[1]).text());
    $("#ong_site").val($(cols[2]).text());
    $("#ong_ativa").prop("checked", $(cols[3]).is(":checked"));
    $("#tituloForm").html("Alterando ONG");
}
$(document).ready(function () {
    listarOngs();
});
