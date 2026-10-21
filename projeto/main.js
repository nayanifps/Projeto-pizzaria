
/*
  Projeto: Pizzaria Forno de Ouro
  Arquivo: js/main.js

  Objetivos:
  - Controlar o menu de navegação.
  - Organizar os dados das pizzas.
  - Calcular o valor do pedido.
  - Validar os dados do formulário.
  - Mostrar informações no console para testes.
*/

// ==========================================
// 1. DADOS DAS PIZZAS
// ==========================================

const cardapio = [
  { nome: "Calabresa", preco: 35.00, categoria: "Salgada" },
  { nome: "Frango com Catupiry", preco: 40.00, categoria: "Salgada" },
  { nome: "Quatro Queijos", preco: 42.00, categoria: "Salgada" },
  { nome: "Chocolate", preco: 38.00, categoria: "Doce" }
];

// Mostra o cardápio organizado no console.
console.table(cardapio);

// ==========================================
// 2. MENU DE NAVEGAÇÃO
// ==========================================

const botaoMenu = document.querySelector(".menu-hamburguer");
const menuNavegacao = document.querySelector(".nav-links");

if (botaoMenu && menuNavegacao) {
  botaoMenu.addEventListener("click", function () {
    const menuAberto = menuNavegacao.classList.toggle("menu-aberto");

    botaoMenu.setAttribute("aria-expanded", String(menuAberto));
  });

  // Fecha o menu depois que um link é selecionado.
  const linksMenu = menuNavegacao.querySelectorAll("a");

  for (const link of linksMenu) {
    link.addEventListener("click", function () {
      menuNavegacao.classList.remove("menu-aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
    });
  }
}

// ==========================================
// 3. FUNÇÃO PARA FORMATAR VALORES EM REAIS
// ==========================================

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// ==========================================
// 4. FORMULÁRIO E CÁLCULO DO PEDIDO
// ==========================================

const formulario = document.querySelector("#form-pedido");

if (formulario) {
  formulario.addEventListener("submit", function (evento) {
    // Impede o envio antes de validar os dados.
    evento.preventDefault();

    const campoNome = formulario.querySelector('[name="nome"]');
    const campoTelefone = formulario.querySelector('[name="telefone"]');
    const campoPizza = formulario.querySelector('[name="pizza"]');
    const campoQuantidade = formulario.querySelector('[name="quantidade"]');
    const campoResumo = document.querySelector("#resumo-pedido");

    // Verifica se os campos necessários existem no HTML.
    if (
      !campoNome ||
      !campoTelefone ||
      !campoPizza ||
      !campoQuantidade ||
      !campoResumo
    ) {
      console.error("Confira os campos do formulário no HTML.");
      return;
    }

    // Recebe e trata os dados digitados.
    const nome = campoNome.value.trim();
    const telefone = campoTelefone.value.trim();
    const nomePizza = campoPizza.value;
    const quantidadeTexto = campoQuantidade.value.trim();
    const quantidade = Number(quantidadeTexto);

    // Validação dos dados de entrada.
    if (nome === "" || telefone === "" || nomePizza === "") {
      alert("Preencha seu nome, telefone e escolha uma pizza.");
      return;
    }

    if (
      quantidadeTexto === "" ||
      !Number.isInteger(quantidade) ||
      quantidade < 1 ||
      quantidade > 20
    ) {
      alert("Informe uma quantidade inteira entre 1 e 20.");
      return;
    }

    // Procura a pizza escolhida no cardápio.
    let pizzaEscolhida = null;

    for (const pizza of cardapio) {
      if (pizza.nome === nomePizza) {
        pizzaEscolhida = pizza;
        break;
      }
    }

    if (pizzaEscolhida === null) {
      alert("A pizza escolhida não foi encontrada.");
      return;
    }

    // Calcula o valor total.
    const total = pizzaEscolhida.preco * quantidade;

    // Define uma mensagem conforme o valor do pedido.
    let mensagem = "";

    if (total >= 100) {
      mensagem = "Seu pedido tem um valor de R$ 100 ou mais.";
    } else {
      mensagem = "Seu pedido foi calculado com sucesso.";
    }

    // Exibe o resumo do pedido na página.
    campoResumo.textContent =
      `Cliente: ${nome}. ` +
      `Pizza: ${pizzaEscolhida.nome}. ` +
      `Quantidade: ${quantidade}. ` +
      `Total: ${formatarMoeda(total)}. ` +
      mensagem;

    // Mostra os dados para conferência no console.
    console.table([
      {
        cliente: nome,
        telefone: telefone,
        pizza: pizzaEscolhida.nome,
        quantidade: quantidade,
        total: formatarMoeda(total)
      }
    ]);

    alert("Pedido calculado! Confira o resumo na página.");
  });
}

// ==========================================
// 5. TESTE DE MESA DO CÁLCULO
// ==========================================

// Exemplo: 2 pizzas de Calabresa a R$ 35,00.
const precoTeste = 35;
const quantidadeTeste = 2;
const totalTeste = precoTeste * quantidadeTeste;

console.log("Teste do pedido:");
console.log(`Preço unitário: ${formatarMoeda(precoTeste)}`);
console.log(`Quantidade: ${quantidadeTeste}`);
console.log(`Total: ${formatarMoeda(totalTeste)}`);
