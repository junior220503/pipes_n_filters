# ADR 001: Adoção do Padrão Pipes and Filters com NestJS

## Status
Aceito

## Contexto
O projeto requer o processamento de imagens (ou dados complexos) que envolve múltiplas etapas sequenciais e independentes: pré-processamento, transformação e análise por IA.
Fazer isso em uma aplicação monolítica acopla demais os processos, dificultando a escalabilidade individual de etapas pesadas (como a IA) e a manutenção do código.

## Decisão
Decidimos implementar a arquitetura baseada no padrão **Pipes and Filters** utilizando microserviços com o framework **NestJS**.

O sistema será dividido em três filtros principais:
1.  **Preprocessing Filter**: Recebe a entrada bruta e normaliza os dados.
2.  **Transformation Filter**: Aplica modificações estruturais ou artísticas.
3.  **AI Filter**: Realiza inferências ou processamentos inteligentes finais.

A comunicação entre os filtros deve ser assíncrona (preferencialmente via filas como RabbitMQ ou Kafka, ou via TCP/HTTP direto se a latência permitir), onde a saída de um serviço torna-se a entrada do próximo.

## Consequências

### Positivas
* **Escalabilidade Independente**: Se o módulo de IA for lento, podemos escalar apenas ele horizontalmente sem duplicar o módulo de pré-processamento.
* **Reusabilidade**: Os filtros podem ser reorganizados para criar novos pipelines.
* **Manutenibilidade**: Cada serviço NestJS foca em uma única responsabilidade (SRP).

### Negativas
* **Complexidade de Infraestrutura**: Requer gerenciamento de 3 aplicações separadas em vez de uma.
* **Latência de Rede**: A comunicação entre filtros adiciona overhead de rede comparado a chamadas de função em memória.