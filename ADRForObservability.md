# ADR 002: Estratégia de Observability

## Status
Aceito

## Contexto
O projeto segue uma arquitetura distribuída baseada no padrão "Pipes and Filters", composta por múltiplos serviços independentes: "preprocessing_filter", "transformation_filter" e "ai_filter".

Neste cenário, o processamento de uma única solicitação de entrada atravessa fronteiras de rede e processos distintos. Identificar a causa raiz de latências ou falhas torna-se complexo, pois os logs isolados de um único contêiner não fornecem a visão completa do fluxo de execução. Por exemplo, um erro no "ai_filter" pode ser consequência de dados mal formatados que passaram silenciosamente pelo "preprocessing_filter".

## Decisão
Decidimos adotar uma estratégia completa de **Observabilidade** baseada em três pilares: **Métricas**, **Rastreamento Distribuído (Tracing)** e **Logs**.

1.  **Padronização com OpenTelemetry:** Utilizaremos o OpenTelemetry (OTel) para instrumentar a aplicação, conforme evidenciado nos arquivos "src/otel.ts" de cada módulo. Isso garante que a coleta de telemetria seja agnóstica ao fornecedor (vendor-neutral).
2.  **Rastreamento Distribuído:** Cada requisição receberá um identificador único (Trace ID) ao entrar no sistema. Esse ID será propagado através dos filtros, permitindo visualizar a cascata de chamadas e o tempo gasto em cada etapa (ex: tempo de inferência no "ai_filter" vs. tempo de transformação).
3.  **Coleta de Métricas:** Utilizaremos o Prometheus para coletar métricas de infraestrutura e de negócio (ex: contagem de requisições, uso de memória dos contêineres, latência HTTP), conforme configuração já existente no "prometheus.yml".

## Consequências

### Positivas
* **Visibilidade Ponta a Ponta:** Permite visualizar o caminho exato de um dado desde a entrada no "preprocessing" até a saída no "ai_filter".
* **Detecção Rápida de Gargalos:** Facilita identificar qual filtro está degradando a performance do pipeline.
* **Debugging Eficiente:** Reduz o tempo para diagnosticar falhas em produção ao correlacionar logs e traces.

### Negativas
* **Complexidade de Implementação:** Exige instrumentação de código em todos os serviços e gerenciamento de sidecars ou agentes coletores.
* **Overhead:** A coleta e envio de telemetria consomem uma pequena fração de recursos (CPU/Rede) da aplicação.
* **Armazenamento:** Gera um volume considerável de dados que precisa ser armazenado e rotacionado.