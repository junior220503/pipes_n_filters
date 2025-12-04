# 1. Pipeline de Processamento de Imagens com Pipes and Filters

Data: 2025-12-04
Status: Aceito

## Contexto
O sistema precisa processar imagens passando por três estágios distintos: pré-processamento, transformação e aplicação de filtro de IA. Cada etapa tem complexidades diferentes e pode precisar escalar de forma independente (ex: o filtro de IA pode demorar mais que o pré-processamento).

## Decisão
Adotamos o padrão arquitetural **Pipes and Filters** implementado como microsserviços usando **NestJS**.
Os componentes são:
1. **Preprocessing Filter:** Validação e limpeza inicial.
2. **Transformation Filter:** Alterações estruturais na imagem.
3. **AI Filter:** Inferência e aplicação do filtro inteligente.

A comunicação entre os filtros será realizada via [DECISÃO: HTTP síncrono ou Fila/RabbitMQ].

## Consequências
* **Positivas:** Desacoplamento das etapas; cada filtro pode ser desenvolvido e escalado por equipes diferentes; facilidade em reordenar o pipeline.
* **Negativas:** Maior complexidade operacional para manter 3 serviços NestJS; latência de rede entre os filtros.