import requests
import json
import time
from kafka import KafkaProducer

PROMETHEUS_URL = "http://prometheus-kube-prometheus-prometheus.default.svc.cluster.local:9090"
KAFKA_BROKER = "kafka-controller-0.kafka-controller-headless.kafka.svc.cluster.local:9092"
TOPIC = "ecoverse-metrics"

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def fetch_metric(query):
    url = f"{PROMETHEUS_URL}/api/v1/query"
    try:
        response = requests.get(url, params={'query': query}, timeout=5)
        result = response.json()
        if result['status'] == 'success':
            return result['data']['result']
    except Exception as e:
        print(f"Error fetching metric {query}: {e}")
    return []

while True:
    # Collect a few sample metrics
    cpu_usage = fetch_metric('node_cpu_seconds_total')
    mem_available = fetch_metric('node_memory_MemAvailable_bytes')
    
    payload = {
        "timestamp": time.time(),
        "cpu": cpu_usage,
        "memory": mem_available
    }
    
    producer.send(TOPIC, payload)
    print(f"Sent to Kafka: {payload}")
    time.sleep(5)
