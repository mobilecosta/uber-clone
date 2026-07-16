# Uber Clone Simulator 🚗📱

Este é um simulador web de alta fidelidade e em tempo real do ecossistema Uber, contendo os aplicativos de **Passageiro**, **Motorista** e um **Painel de Controle do Administrador** integrados em um portal interativo com tela dividida (Split Screen). 

A aplicação utiliza **Supabase** como banco de dados e backend em tempo real para sincronização instantânea de rotas, localização por GPS simulado e bate-papo, junto com a biblioteca **Leaflet.js** para renderização de mapas interativos.

---

## 🚀 Demonstração Visual e Funcionalidades

### 1. Aplicativo do Passageiro (`passenger.html`)
* **Solicitação de Viagem**: Escolha de pontos de partida e destino baseados em locais reais de São Paulo.
* **Categorias Premium**: Seleção de categorias (UberX, Uber VIP, Uber Black, Uber Flash) com tarifas calculadas dinamicamente com base na distância.
* **Acompanhamento ao Vivo**: Rastreamento em tempo real do veículo se deslocando no mapa.
* **Chat Integrado**: Comunicação direta e instantânea com o motorista.
* **Feedback**: Avaliação do motorista por estrelas ao fim da corrida.

### 2. Aplicativo do Motorista (`driver.html`)
* **Status de Conectividade**: Controle para ficar Online/Offline.
* **Correspondência de Corridas**: Sistema de ofertas de corrida com timer de aceitação de 15 segundos.
* **Simulação de Deslocamento**: Animação de rota integrada que move o veículo no GPS até a origem e depois até o destino.
* **Carteira Digital**: Histórico e painel de faturamento diário atualizados na hora.

### 3. Painel do Administrador (`admin.html`)
* **Métricas Gerais**: Faturamento global da plataforma, quantidade total de corridas, motoristas online e nota média dos parceiros.
* **GPS Geral Feed**: Mapa de visualização global para monitorar todos os veículos ativos e caminhos de corrida no mapa.
* **Controle Tarifário**: Visualização de tarifas base para as categorias.

---

## 🛠️ Como Configurar o Banco de Dados (Supabase)

A persistência e o Realtime rodam inteiramente com base no **Supabase**. Siga os passos abaixo para configurar o seu:

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No menu lateral do painel, abra o **SQL Editor** e clique em **New Query**.
3. Copie as queries do arquivo [setup.sql](setup.sql) localizado na raiz deste projeto.
4. Cole no editor e clique em **Run** para criar as tabelas (`profiles`, `rides`, `messages`) e ativar o canal de Realtime.
5. Acesse **Project Settings > API** e copie o **Project URL** e a chave **Anon Public Key**.

---

## 💻 Executando o Projeto Localmente

1. Clone o repositório ou baixe os arquivos em sua máquina.
2. Dê um duplo clique no arquivo [index.html](index.html) para abrir o simulador no seu navegador.
3. Insira as credenciais do seu projeto Supabase no modal que será exibido nas janelas (as chaves ficarão salvas localmente de forma segura no seu navegador).
4. **Pronto!** Agora você pode usar a interface Split Screen para simular uma corrida inteira em tempo real no mesmo monitor.

---

## 📐 Estrutura de Arquivos

* `index.html` - Portal unificado e simulador de tela dividida.
* `passenger.html` - Interface do Passageiro.
* `driver.html` - Interface do Motorista.
* `admin.html` - Dashboard do Administrador.
* `setup.sql` - Script SQL de tabelas e trigger Realtime.
* `css/style.css` - Estilo visual premium com glassmorphism e dark mode.
* `js/shared.js` - Lógica compartilhada do mapa, rotas e distância.
* `js/supabase-config.js` - Inicializador e gerenciador das chaves do Supabase.

---

Desenvolvido com 🖤 para simulação de sistemas distribuídos e de tempo real.
