# ADR 003: Estratégia de Load Balancing

## Status
Aceito

## Contexto
Os filtros que compõem o pipeline possuem perfis de consumo de recursos extremamente assimétricos.
* O "preprocessing_filter" e o "transformation_filter" tendem a realizar operações rápidas de I/O ou manipulação de strings.
* O "ai_filter", por sua natureza de inferência de Inteligência Artificial, é uma operação intensiva de CPU/GPU e inerentemente mais lenta.

Se o sistema receber um pico de tráfego, uma única instância do "ai_filter" se tornará um gargalo, causando *backpressure* nos filtros anteriores e potencialmente derrubando o serviço por falta de recursos.

## Decisão
Decidimos implementar o **Balanceamento de Carga Horizontal** para garantir a escalabilidade e resiliência do pipeline.

1.  **Escalonamento Independente:** Cada filtro será implantado como um serviço que pode ter múltiplas réplicas rodando simultaneamente. O "ai_filter", sendo o mais pesado, poderá ter um número maior de réplicas comparado aos filtros leves.
2.  **Distribuição de Tráfego:** Utilizaremos o balanceamento de carga interno da rede de contêineres (Service Discovery/Load Balancer do Docker ou Kubernetes). Quando o "transformation_filter" chamar o "ai_filter", a requisição será distribuída entre as réplicas disponíveis.
3.  **Statelessness:** Todos os filtros devem ser mantidos stateless para permitir que qualquer instância processe qualquer pacote de dados a qualquer momento.

## Consequências

### Positivas
* **Alta Disponibilidade:** Se uma instância do "ai_filter" falhar, o balanceador redireciona o tráfego para as outras instâncias saudáveis, evitando a interrupção do serviço.
* **Elasticidade:** Permite aumentar a capacidade de processamento do gargalo (IA) sem desperdiçar recursos escalando componentes que não precisam (pré-processamento).
* **Melhor Latência:** Sob carga alta, o tempo de resposta médio se mantém estável, pois o trabalho é dividido.

### Negativas
* **Custo de Infraestrutura:** Executar múltiplas réplicas do filtro de IA aumenta o consumo de recursos de hardware.
* **Complexidade de Configuração:** Requer ajustes finos nas configurações de *health checks* para garantir que o balanceador não envie tráfego para instâncias que ainda estão inicializando.