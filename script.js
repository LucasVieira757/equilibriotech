'use strict';

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = isOpen;
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 880) closeMenu(); });

// Simulação de dados fictícios: não envia nem armazena informações.
const demoRows = document.querySelectorAll('.demo-table tbody tr');
const runButton = document.querySelector('#run-demo');
const resetButton = document.querySelector('#reset-demo');
const demoFindings = document.querySelector('#demo-findings');
const resultHeading = document.querySelector('#demo-result-heading');
const resultText = document.querySelector('#demo-result');

runButton.addEventListener('click', () => {
  const labels = {
    ok: '<span class="status-good">✓ Validado</span>',
    missing: '<span class="status-review">! Sem quantidade</span>',
    duplicate: '<span class="status-review">! Duplicado</span>',
    invalid: '<span class="status-review">! Quantidade inválida</span>'
  };
  demoRows.forEach(row => {
    row.classList.add('checked');
    row.querySelector('.status-cell').innerHTML = labels[row.dataset.state];
  });
  resultHeading.textContent = 'Análise concluída';
  resultText.textContent = '5 registros analisados; 3 pontos precisam de revisão.';
  demoFindings.hidden = false;
  runButton.disabled = true;
  runButton.textContent = 'Conferência concluída ✓';
  runButton.setAttribute('aria-disabled', 'true');
});

resetButton.addEventListener('click', () => {
  demoRows.forEach(row => {
    row.classList.remove('checked');
    row.querySelector('.status-cell').innerHTML = '<span class="unverified">—</span>';
  });
  resultHeading.textContent = 'Pronto para conferir';
  resultText.textContent = 'Clique no botão para analisar cinco registros de exemplo.';
  demoFindings.hidden = true;
  runButton.disabled = false;
  runButton.innerHTML = 'Analisar planilha <span aria-hidden="true">↗</span>';
  runButton.removeAttribute('aria-disabled');
});

// Formspree: envio AJAX sem abrir o app de e-mail do visitante.
// Nunca marcar como enviado se o endpoint não foi configurado ou falhou.
const form = document.querySelector('#lead-form');
const typeField = document.querySelector('#lead-type');
const formMessage = document.querySelector('#form-message');
const submitButton = document.querySelector('#form-submit');
const submitLabel = document.querySelector('.submit-label');
const config = window.EQUILIBRIOTECH_CONFIG || {};
let submitting = false;

function configuredFormId() {
  const id = String(config.formspreeFormId || '').trim();
  return /^[a-zA-Z0-9]{7,16}$/.test(id) && id !== 'COLE_SEU_FORM_ID';
}

function showMessage(message, type = 'info') {
  formMessage.textContent = message;
  formMessage.dataset.type = type;
}

function setSending(isSending) {
  submitting = isSending;
  submitButton.disabled = isSending;
  submitButton.setAttribute('aria-busy', String(isSending));
  submitLabel.textContent = isSending ? 'Enviando solicitação…' : 'Enviar solicitação';
}

function validateContactForm() {
  const fields = [...form.querySelectorAll('input[required],select[required],textarea[required]')];
  for (const el of fields) {
    if (el.type !== 'checkbox' && typeof el.value === 'string') el.value = el.value.trim();
    if (!el.checkValidity()) {
      el.reportValidity();
      el.focus();
      showMessage('Confira os campos obrigatórios antes de enviar.', 'error');
      return false;
    }
  }
  return true;
}

form.addEventListener('input', () => {
  if (formMessage.dataset.type === 'error') showMessage('');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitting || !validateContactForm()) return;

  if (!configuredFormId()) {
    showMessage('O envio direto ainda não foi ativado. Entre em contato por e-mail: ' + (config.contactEmail || 'lucasvst91@gmail.com') + '. A EquilíbrioTech precisa configurar o Formspree antes de publicar.', 'error');
    return;
  }

  if (form.elements.namedItem('_gotcha')?.value) {
    showMessage('Não foi possível enviar a solicitação. Entre em contato pelo e-mail indicado ao lado.', 'error');
    return;
  }

  setSending(true);
  showMessage('Enviando sua solicitação com segurança…', 'info');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const payload = new FormData(form);
    payload.set('_subject', 'Nova solicitação — EquilíbrioTech — ' + payload.get('company'));
    const response = await fetch('https://formspree.io/f/' + config.formspreeFormId.trim(), {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: payload,
      signal: controller.signal
    });

    let result = {};
    try { result = await response.json(); } catch (_) { /* Sem JSON: avaliar status HTTP. */ }

    if (!response.ok || result.ok === false) {
      const providerErrors = Array.isArray(result.errors) ? result.errors.map(e => e.message).filter(Boolean) : [];
      throw new Error(providerErrors[0] || 'O serviço não conseguiu receber a mensagem. Tente novamente.');
    }

    showMessage('Solicitação enviada! Sua mensagem foi recebida pelo serviço de formulários. A EquilíbrioTech poderá responder pelo e-mail informado.', 'success');
    form.reset();
  } catch (error) {
    const reason = error?.name === 'AbortError'
      ? 'A conexão demorou demais. Confirme se o serviço recebeu antes de tentar novamente.'
      : error instanceof TypeError
        ? 'Não foi possível conectar ao serviço de formulários. Confira a internet e tente novamente.'
        : (error?.message || 'Ocorreu um erro ao enviar.');
    showMessage(reason + ' Se persistir, escreva para ' + (config.contactEmail || 'lucasvst91@gmail.com') + '.', 'error');
  } finally {
    clearTimeout(timeout);
    setSending(false);
  }
});

// CTAs de serviço já levam a opção selecionada ao formulário.
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  const option = Array.from(typeField.options).find(opt => opt.value === link.dataset.service);
  if (option) typeField.value = option.value;
  showMessage('');
}));

document.querySelector('#year').textContent = new Date().getFullYear();
