let id = 0
let valorTotal = 0
let placaConsultar = ''
const usuario = 'Matheus_Kuc' // Simula um login

function enviar() {
    const placa_informada = document.getElementById("num_placa").value
    if (placa_informada.length < 7) {
        dialog("Placa Inválida")
        return
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var cliente = JSON.parse(this.responseText);
            console.log(cliente)
        }
    }

    xmlhttp.open("GET", "https://hernanicruz.com/aulas/estacionamento/registrarEntradaGet.php?placa=" + placa_informada + "&user=TESTE", false);
    xmlhttp.send();

    // const resp = registrarEntrada(placa_informada, usuario)
    // dialog(resp)

    document.getElementById("num_placa").value = "";
}

function consultar() {
    var placa_informada = document.getElementById("num_placa").value;
    if (placa_informada.length < 7) {
        dialog("Placa Inválida");
        return;
    }

    const resp = prePagamento(placa_informada)

    if (resp.error !== undefined) {
        dialog(resp.error)
        return
    }

    id = resp.id;

    var horas = resp.horas
    var placa = resp.placa;
    var valorPorHora = 15;

    valorTotal = valorPorHora * horas;
    placaConsultar = placa_informada;

    var msg = "O veículo com placa " + placa + " ficou por " + horas + " horas. Valor por hora de R$" + valorPorHora + ",00. Total do estacionamento ficou em R$" + valorTotal + ",00.";

    dialog(msg)
    document.getElementById("buttonPagamento").disabled = false;
}

function pagamento() {
    var placa_informada = document.getElementById("num_placa").value;
    if (placa_informada.length < 7) {
        dialog("Placa Inválida");
        return;
    }

    if (placa_informada === placaConsultar) {
        const resp = registrarPagamento(placa_informada, valorTotal)

        dialog(resp)
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

const veiculos = []

function criarVeiculo(placa, usuario) {
    const cadastro = {
        "id": Math.random(),
        "horario_server": new Date(),
        "entrada": new Date(),
        "placa": placa,
        "saida": false,
        "valor": null,
        "user": usuario,
        "horas": 3
    }
    veiculos.push(cadastro)
}

function registrarEntrada(placa, usuario) {
    let notExist = true
    veiculos.forEach(v => {
        if (placa === v.placa && v.saida === false) {
            notExist = false
        }
    })

    if (notExist) {
        criarVeiculo(placa, usuario)
        return "Registrado com sucesso!"
    }

    return "Veículo já esta cadastrado!"
}

function prePagamento(placa) {
    let exist = false
    let veiculo
    veiculos.forEach(v => {
        if (placa === v.placa && v.saida === false) {
            exist = true
            veiculo = v
        }
    })

    if (!exist) return { error: 'Não existe nenhum veículo com essa placa' };

    return veiculo
}

function registrarPagamento(placa, valor) {
    let veiculo
    veiculos.forEach(v => {
        if (placa === v.placa && v.saida === false) {
            veiculo = v
        }
    })
    veiculo.saida = true
    veiculo.valor = valor

    return 'Pagamento efetuado com sucesso! No valor de R$' + valor + ',00.'
}