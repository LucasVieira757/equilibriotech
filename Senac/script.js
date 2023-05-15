const botaoAdicionarAoCarrinho = document.getElementById('adicionar-ao-carrinho');

botaoAdicionarAoCarrinho.addEventListener('click', () => {
  // Adicione o produto ao carrinho aqui
  console.log('Produto adicionado ao carrinho');
});

const carrinho = [];

function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const carrinhoElemento = document.getElementById('carrinho');
  carrinhoElemento.innerHTML = '';

  carrinho.forEach((produto) => {
    const item = document.createElement('li');
    item.textContent = produto.nome + ' - R$ ' + produto.preco;
    carrinhoElemento.appendChild(item);
  });
}
const formulario = document.querySelector('form');
const nome = document.getElementById('nome');
const email = document.getElementById('email');

formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  if (nome.value === '') {
    alert('Por favor, preencha o campo Nome.');
    nome.focus();
    return;
  }

  if (email.value === '') {
    alert('Por favor, preencha o campo E-mail.');
    email.focus();
    return;
  }

  // Envie o formulário aqui
});