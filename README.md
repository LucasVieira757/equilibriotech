# EquilíbrioTech V2 — site comercial

Landing page comercial desenvolvida em **HTML, CSS e JavaScript puro**, sem frameworks, dependências ou comando de build. Mantém o visual original da V1 e adiciona os cinco serviços, captação de leads via Formspree e aviso de privacidade.

## O que o site oferece

- Proposta de valor centrada em redução de trabalho manual, com textos voltados a pequenas e médias empresas.
- Cinco serviços: **Automação de Excel e planilhas**, **Automação de processos**, **Dashboards e relatórios**, **Criação de sites profissionais** e **Sistemas internos personalizados**.
- Demonstração clicável de conferência de planilhas **usando somente dados fictícios e sem transferência de arquivos**.
- Projetos de demonstração e piloto, identificados corretamente, sem clientes ou resultados inventados.
- Formulário responsivo, com envio assíncrono diretamente na página (depois de configurar o Formspree).
- Acessibilidade básica, navegação por teclado, menu responsivo, metadados e seção de transparência sobre dados.

## Passo essencial: ativar o formulário (obrigatório)

O projeto é distribuído **sem credenciais e sem Form ID ativo**. O fluxo e o tratamento de erros estão implementados, mas **a entrega real de mensagens só funcionará após configurar uma conta do Formspree e testar um envio verdadeiro**. Sem isso, o site mostra uma mensagem de configuração pendente, em vez de anunciar envio bem-sucedido.

1. Abra <https://formspree.io/> e crie sua conta (ou entre numa conta existente).
2. Crie um novo formulário no painel do Formspree.
3. Configure o e-mail de notificações para **`lucasvst91@gmail.com`** e **conclua a confirmação do endereço**, quando solicitada pela plataforma.
4. Na área de integração, copie a URL de envio, parecida com `https://formspree.io/f/abcdefgh`. O trecho `abcdefgh` é seu **Form ID** (o identificador exato será fornecido pelo serviço).
5. Abra **`config.js`** no VS Code e substitua **`COLE_SEU_FORM_ID`** pelo identificador real. **Não** cole a URL inteira, apenas o ID. Exemplo:

   ```js
   window.EQUILIBRIOTECH_CONFIG = Object.freeze({
     formspreeFormId: 'abcdefgh',
     contactEmail: 'lucasvst91@gmail.com'
   });
   ```

6. Salve, publique e faça um envio de teste **pelo formulário no endereço publicado**, preenchendo um e-mail seu e um problema fictício.
7. Confirme que apareceu a mensagem de sucesso **e** que a solicitação foi registrada no painel Formspree e chegou ao Gmail esperado. Confira Spam/Promoções e verifique as configurações de notificação, se necessário.
8. Faça também um teste de validação (campo e-mail inválido) e um teste sem conexão. O site deve mostrar erro e preservar os campos preenchidos.

**Segurança:** um Form ID é um identificador público de endpoint; não é uma senha. Não coloque senhas, tokens administrativos, API keys secretas, chaves de serviço ou dados de clientes no JavaScript. Avalie a restrição por domínio no Formspree após publicar no domínio definitivo; o Formspree também fornece proteções contra spam e aceita o campo `_gotcha`. Nunca anexe planilhas de clientes sem definir um processo seguro de recebimento e tratamento.

**Limites:** o Formspree é uma ferramenta de terceiros, com regras, possíveis limites e preços próprios. A interface de sucesso indica confirmação da API de recebimento — e não garante leitura humana nem entrega imediata da notificação por e-mail. É possível conferir os recebimentos no painel do serviço.

## Como testar localmente no VS Code

1. Extraia o ZIP e abra a pasta `equilibriotech-v2` no VS Code.
2. Recomendo usar Live Server **ou** iniciar um servidor estático:

   ```bash
   python -m http.server 5500
   ```

3. Acesse `http://localhost:5500/` no navegador.
4. Teste menu, demonstração, links e layout móvel. O formulário **não enviará** sem o Form ID real — isso é intencional.
5. Para testar o envio verdadeiro, use a conta Formspree configurada e confira o painel; **não use um ID fictício**.

## Publicar no GitHub e Cloudflare Pages

1. Crie um repositório GitHub, por exemplo `equilibriotech-site`.
2. Faça upload de **todos os arquivos e da pasta `assets/`**, deixando `index.html`, `config.js`, `script.js` e `styles.css` na raiz do repositório.
3. No Cloudflare, abra **Workers & Pages → Create → Pages → Connect to Git** (nomes podem variar na interface).
4. Conecte seu repositório e selecione a branch principal.
5. Framework preset: **None**. Build command: **em branco**. Output directory: **a raiz do projeto** (`/` ou conforme a interface). Root directory: diretório onde está o `index.html`.
6. Publique e confirme a URL que o Cloudflare fornecer. **Não existe domínio público atribuído neste arquivo**.
7. Teste o formulário no endereço publicado e valide entrada no painel Formspree + recebimento do e-mail.
8. Em atualizações futuras, basta alterar os arquivos e fazer um novo push.

## O que editar antes de divulgar

- E-mail de contato na página: `index.html` (links `mailto:` são **apenas alternativa** ao formulário) e em `config.js`.
- Form ID real: somente `config.js`.
- Serviços e textos: `index.html`.
- Identidade visual e responsividade: `styles.css`.
- Lógica de formulário, demonstração e menu: `script.js`.
- Logo e favicon: `assets/`.
- Caso publique em domínio próprio, inclua canonical/OG URL após saber a URL definitiva.

## Formulário: comportamento esperado

| Cenário | Resultado esperado |
|---|---|
| Campos obrigatórios ausentes ou e-mail inválido | Envio bloqueado com pedido para corrigir o campo |
| Form ID não configurado | Erro claro; **nenhum** sucesso fictício |
| Envio em andamento | Botão desabilitado e mensagem de carregamento |
| API aceita a solicitação | Mensagem de confirmação, campos limpos |
| Falha de rede/API | Erro visível, informações preservadas, indicação do e-mail alternativo |
| Clique em CTA de um serviço | Serviço correspondente pré-selecionado no formulário |
| Botão da demonstração | 5 registros fictícios analisados, 3 problemas mostrados; reinício disponível |

## Tratamento de dados e privacidade

O formulário recolhe nome, empresa, e-mail, telefone opcional, serviço escolhido, descrição e consentimento; deve ser utilizado apenas para responder à solicitação e conversar sobre a prestação de serviços. A seção **Privacidade** contém um aviso inicial de transparência e link para o provedor. O site **não mantém banco de dados próprio** para as mensagens. Como o Formspree pode processar e armazenar submissões na conta, revise a política de privacidade e as configurações do serviço antes de divulgar. A adequação completa à LGPD exige revisar os processos reais de atendimento e retenção de dados.

## Estrutura de arquivos

```text
equilibriotech-v2/
├── index.html          # Conteúdo, estrutura e campos do formulário
├── styles.css          # Identidade visual, desktop e mobile
├── script.js           # Menu, demonstração e envio Formspree
├── config.js           # Um único lugar para inserir o Form ID
├── assets/
│   ├── logo.svg
│   └── favicon.svg
└── README.md
```

## Problemas mais comuns

- **Não aparece mensagem de sucesso:** verifique o Form ID e os erros mostrados no formulário. No painel do Formspree, confirme se o formulário foi criado e está ativo.
- **Mensagem de sucesso, mas nada no Gmail:** confira primeiro os envios no painel Formspree, depois o endereço de notificação, confirmação da conta e caixa de spam do Gmail.
- **Erro de rede:** confira internet e bloqueadores do navegador. O site mantém o que foi digitado para nova tentativa.
- **Botões parecem sem ação:** confirme upload de `script.js` e `config.js`, na raiz, e abra o console do navegador.
- **Imagens ou estilos sumiram:** confirme que as pastas e os nomes dos arquivos foram publicados sem alterações de maiúsculas/minúsculas.

## Licenciamento dos elementos visuais

Nenhuma imagem de terceiros foi incluída. O logotipo, cards, dashboard ilustrativo e outros elementos visuais são SVG/HTML/CSS locais. Não são imagens de resultados de clientes.
