# Manual do Desenvolvedor - App Secador

Este guia contém as instruções básicas para manutenção, atualização e publicação do aplicativo.

## 1. Rodar Localmente (Testar no PC)
Para abrir o aplicativo no seu computador para testes:

1.  Abra o terminal na pasta do projeto.
2.  Execute o comando:
    ```bash
    npm run dev
    ```
3.  O terminal mostrará um link (geralmente `http://localhost:5173`). Clique nele para abrir no navegador.
4.  Para parar, aperte `Ctrl + C` no terminal.

## 2. Criar uma Nova Versão (Lançar Atualização)
Siga estes passos quando quiser lançar novidades para os usuários.

### Passo A: Atualizar o Aviso de Novidades (Changelog)
Edite o arquivo: `src/utils/changelog.js`

1.  Copie todo o bloco da versão atual (do `{` até o `},`).
2.  Cole ele no **topo** da lista `changelog` (logo após o `[`).
3.  Atualize os dados:
    *   **version**: Mude o número (ex: de `"1.0.5"` para `"1.0.6"`).
    *   **title**: Mude o título da atualização.
    *   **changes**: Adicione ou remova itens na lista de mudanças.
    *   *Dica: Mantenha os textos em `pt` (Português), `en` e `es`.*

### Passo B: Atualizar a Versão do Projeto
Edite o arquivo: `package.json` (na raiz do projeto).

1.  Procure pela linha `"version": "..."`.
2.  Mude o número para ser **igual** ao que você colocou no changelog (ex: `"1.0.6"`).

> **Nota:** O modal de "Novidades" só aparecerá para o usuário se o número da versão no `package.json` for maior do que a versão anterior que ele acessou.

## 3. Subir para Produção (Publicar na Internet)
Para enviar suas alterações para a Vercel e tornar público:

1.  Garanta que salvou todos os arquivos.
2.  No terminal, execute:
    ```bash
    npx vercel --prod
    ```
3.  Aguarde o processo. Quando terminar, ele mostrará o link de produção (ex: `https://app-web-secador.vercel.app`).

---

### Resumo do Fluxo de Trabalho
1.  Faça suas alterações no código.
2.  Teste rodando `npm run dev`.
3.  Tudo pronto? **Atualize o changelog.js** e o **package.json**.
4.  Publique com `npx vercel --prod`.
