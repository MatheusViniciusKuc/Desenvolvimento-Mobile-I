let id = 0
let valorTotal = 0
let placaConsultar = ''
const usuario = 'Matheus Kuc' // Simula um login

function enviar() {
    const placa_informada = document.getElementById("num_placa").value
    if (placa_informada.length < 7) {
        dialog("Placa Inválida")
        document.getElementById("num_placa").value = "";
        return
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const cliente = JSON.parse(this.responseText)
            const dataEntrada = cliente.entrada
            const saida = cliente.saida

            const data = new Date();
            const dataFormatada = data.toISOString().substr(0, 19).replace('T', ' ');

            if (dataEntrada === dataFormatada && (saida === null || saida !== false)) {
                dialog("Veículo registrado com sucesso!")
            } else {
                dialog("Veículo já registrado!")
            }
        }
    }

    xmlhttp.open("GET", "https://hernanicruz.com/aulas/estacionamento/registrarEntradaGet.php?placa=" + placa_informada + "&user=" + usuario, true);
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
            if (this.responseText === 'Veículo não encontrado') {
                dialog(this.responseText)
                document.getElementById("num_placa").value = "";
                return;
            }

            const cliente = JSON.parse(this.responseText)
            const entrada = cliente.entrada
            const placa = cliente.placa
            const valorPorHora = 5
            id = cliente.id

            dialog(mensagemConsulta(entrada, valorPorHora, placa))
        }
    }

    xmlhttp.open("GET", "https://hernanicruz.com/aulas/estacionamento/prePagamentoGet.php?placa=" + placa_informada, true);
    xmlhttp.send();
    document.getElementById("buttonPagamento").disabled = false;
}

function pagamento() {
    var placa_informada = document.getElementById("num_placa").value;
    if (placa_informada.length < 7) {
        document.getElementById("num_placa").value = "";
        dialog("Placa Inválida");
        return;
    }

    if (placa_informada === placaConsultar) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const cliente = JSON.parse(this.responseText)
                if (cliente.mensagem !== undefined) {
                    dialog("Pagamento efetuado com sucesso!")
                } else {
                    dialog("Já foi realizado o pagamento!")
                }
            }
        }

        xmlhttp.open("GET", "https://hernanicruz.com/aulas/estacionamento/registrarPagamentoGet.php?id=" + id + "&valor=" + valorTotal, true);
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

function mensagemConsulta(entrada, valorHora, placa) {
    const dataEntrada = new Date(entrada)
    const dataAtual = new Date()

    const diferencaMili = (dataAtual - dataEntrada)
    const minutos = verifarMinutos(diferencaMili)
    const horas = Math.floor((diferencaMili / 1000) / 3600)
    valorTotal = valorHora * horas

    const dataEntradaFormatada = dataEmFormatoBr(dataEntrada)
    const dataAtualFormatada = dataEmFormatoBr(dataAtual)

    return "O veículo com placa " + placa + " ficou por " + horas + " horas e " + minutos + " minutos. Valor por hora de R$" + valorHora + ",00. Total do estacionamento ficou em R$" + valorTotal + ",00. Ficou da data " + dataEntradaFormatada + " até " + dataAtualFormatada + "."
}

function verifarMinutos(milisegundos) {
    const minutos = Math.floor((milisegundos / 1000) / 60)
    const qtdHoras = Math.floor(minutos / 60);
    if (qtdHoras > 0) {
        return minutos - 60 * qtdHoras
    }

    return minutos
}

function dataEmFormatoBr(data) {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear().toString();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
}