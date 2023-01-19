const urlBase = "https://hernanicruz.com/aulas/estacionamento/";
var id = 0;
var valorTotal = 0;
var placaConsultar = "";

function enviar() {
    var placa_informada = document.getElementById("num_placa").value;
    if (placa_informada.length < 7) {
        dialog("Placa Inválida");
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var cliente = JSON.parse(this.responseText);
            var msg = "A placa " + placa_informada + " do " + cliente.mensagem;
            dialog(msg);
        }
    };

    xmlhttp.open("GET", urlBase + "registrarEntradaGet.php?placa=" + placa_informada, true);
    xmlhttp.send();
    document.getElementById("num_placa").value = "";
}

function consultar() {
    var placa_informada = document.getElementById("num_placa").value;
    if (placa_informada.length < 7) {
        dialog("Placa Inválida");
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var cliente = JSON.parse(this.responseText);
            var erro = cliente.erro;

            if (erro) {
                dialog("Veículo não possui entrada no estacionamento");
                document.getElementById("buttonPagamento").disabled = true;
                return;
            }

            id = cliente.id;
            var dataEntrada = cliente.entrada;
            var dataSaida = cliente.data_server;
            var dataEntradaArray = dataEntrada.split(" ");
            var dataSaidaArray = dataSaida.split(" ");
            var dataEntradaDateArray = dataEntradaArray[0].split("-");
            var dataSaidaDateArray = dataSaidaArray[0].split("-");
            var dateEntrada = dataEntradaDateArray[2] + "/" + dataEntradaDateArray[1] + "/" + dataEntradaDateArray[0];
            var dateSaida = dataSaidaDateArray[2] + "/" + dataSaidaDateArray[1] + "/" + dataSaidaDateArray[0];

            var dias = cliente.dias;
            var minutosTotais = cliente.total_minutos;
            var placa = cliente.placa;
            var valorPorHora = 15;
            var horasSemFormatar = minutosTotais / 60;
            var horas = parseInt(horasSemFormatar);
            var minutos = parseInt((horasSemFormatar - horas) * 60);

            valorTotal = valorPorHora * horas;
            placaConsultar = placa_informada;

            var msg = "O veículo com placa " + placa + " ficou por " + dias + " dias, " + horas + " horas e " + minutos + " minutos. Valor por hora de R$" + valorPorHora + ",00. Total do estacionamento ficou em R$" + valorTotal + ",00. Ficou do dia " + dateEntrada + " " + dataEntradaArray[1] + " até o dia " + dateSaida + " " + dataSaidaArray[1] + ".";

            dialog(msg);
        }
    };

    xmlhttp.open("GET", urlBase + "prePagamentoGet.php?placa=" + placa_informada, true);
    xmlhttp.send();
    document.getElementById("buttonPagamento").disabled = false;
}

function pagamento() {
    var placa_informada = document.getElementById("num_placa").value;
    if (placa_informada.length < 7) {
        dialog("Placa Inválida");
        return;
    }

    if (placa_informada === placaConsultar) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var cliente = JSON.parse(this.responseText);

                var mensagem = cliente.mensagem;
                var valor = cliente.valor;

                var msg = mensagem + " No valor de R$" + valor + ",00";
                dialog(msg);
            }
        };

        xmlhttp.open("GET", urlBase + "registrarPagamentoGet.php?placa=" + placa_informada + "&id=" + id + "&valor=" + valorTotal, true);
        xmlhttp.send();
    } else {
        dialog("A placa " + placa_informada + " informada é diferente da placa " + placaConsultar + " consultada! Consulte essa placa antes de fazer o pagamento.");
    }
    document.getElementById("buttonPagamento").disabled = true;
    document.getElementById("num_placa").value = "";
}

function buttonActive(isSaida) {
    document.getElementById("botaoEntrada").disabled = !isSaida;
    document.getElementById("botaoSaida").disabled = isSaida;
    document.getElementById("buttonConfirmarEntrada").hidden = isSaida;
    document.getElementById("buttonConsultarSaida").hidden = !isSaida;
    document.getElementById("buttonPagamento").hidden = !isSaida;
}

function dialog(mensagem) {
    document.getElementById("dialogMsg").innerHTML = mensagem;
    document.getElementById("dialog").open = true;
}