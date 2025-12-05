# Run project
docker compose up --build -d

# Stop project
docker compose down -v

# Setting Up Observability with Grafana, Prometheus, and Jaeger

## 1. Verify Metrics in Prometheus

### 1.1. Check Prometheus
1. Open **Prometheus** in your browser: `http://localhost:9090`.
2. Go to the **"Targets"** page: `Status > Targets`.
3. Ensure that Prometheus is scraping metrics from **otel-collector** (look for the OTLP endpoint: `http://otel-collector:9464/metrics`).

### 1.2. Check Metrics in Prometheus
1. In **Prometheus**, go to the **"Graph"** page (`http://localhost:9090/graph`).
2. Type `up` in the query field and click **Execute**. This will show you the status of all the services being scraped.
3. If everything is working, the status should show `1` (meaning "up") for your **otel-collector** and other services.

---

## 2. Configure Grafana for Prometheus Metrics

### 2.1. Add Prometheus Data Source in Grafana
1. Open **Grafana** (`http://localhost:3000`) and log in (default login is `admin` / `admin`).
2. On the left sidebar, click on the **gear icon** for settings.
3. Select **"Data Sources"**.
4. Click **"Add data source"**.
5. Select **"Prometheus"** from the list.
6. Set the **URL** to Prometheus (`http://prometheus:9090`).
7. Click **Save & Test** to verify the connection.

### 2.2. Visualize Metrics in Grafana
1. Once the Prometheus data source is added, go to the **"Dashboard"** section in Grafana.
2. Click **"Create a New Dashboard"**.
3. Add a new **panel** by clicking **"Add Panel"**.
4. In the query section, select **Prometheus** as the data source.
5. Type `up` to visualize the status of your services.
6. Customize the panel to visualize other metrics from your application. For example, you can query for `otelcol_*` or any custom metric that your filters expose.

---

## 3. Configure Jaeger in Grafana for Tracing

### 3.1. Add Jaeger Data Source in Grafana
1. Open **Grafana** (`http://localhost:3000`) if it's not already open.
2. Go to **Settings** (the gear icon) and select **Data Sources**.
3. Click **Add Data Source**.
4. Select **Jaeger** from the list of available data sources.
5. Set the **URL** to the Jaeger endpoint (this is the HTTP endpoint where Jaeger is receiving traces):
   - `http://jaeger:16686` for the Jaeger UI.
6. Click **Save & Test** to ensure the connection is working.

### 3.2. Visualize Traces in Grafana
1. Go to the **Explore** tab on the left sidebar.
2. Choose **Jaeger** from the data source dropdown.
3. In the **Service** dropdown, select one of your services, like `preprocessing-filter`, `transformation-filter`, or `ai-filter`.
4. You should see traces associated with the selected service.
