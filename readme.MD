# Gerador de Cartões com QR Code

Este é um projeto de geração de cartões com QR Code personalizados a partir de uma lista de dados. Ele utiliza a biblioteca `canvas` para desenhar os cartões e o serviço TinyURL para encurtar URLs dos QR Codes.

## Funcionalidades

- Gera cartões personalizados com QR Code para cada entrada na lista de dados.
- Utiliza o TinyURL para encurtar as URLs dos QR Codes.
- Gera tanto imagens PNG quanto arquivos PDF dos cartões.

## Requisitos

Certifique-se de ter os seguintes requisitos instalados:

- Node.js
- npm ou yarn (gerenciadores de pacotes)
- Chave de API do TinyURL (obtenha-a em https://tinyurl.com/tools/apideveloper)
- Dados em um arquivo JSON no formato necessário (consulte dados.json)

## Instalação

1. Clone este repositório:

```bash
git clone https://github.com/LucasRocha-01/EZqrCodeCards.git
```

2. Navegue para o diretório do projeto:

```bash
cd seu-repositorio
```

3. Instale as dependências:

```bash
npm install
```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
API_KEY_TINYURL=SUA_CHAVE_DE_API_DO_TINYURL

SITE_URL=SEU_SITE_PARA_DIRECIONAMENTO
```

2. Coloque os dados no formato JSON no arquivo `dados.json`.

## Uso

1. Certifique de adicionar o Card em o ./modelo com o nome "card.png".
2. Execute o seguinte comando para gerar os cartões:

```bash
npm start
```

Isso processará os dados do arquivo `dados.json` e gerará os cartões com QR Code em formato PNG e PDF.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais detalhes.

Certifique-se de ajustar as partes relevantes, como URL do repositório, instruções de instalação
