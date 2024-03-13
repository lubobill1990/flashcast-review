from load_env import load_env
import os

load_env()

broker_url = os.getenv('CELERY_BROKER_URL')
result_backend = os.getenv('CELERY_RESULT_BACKEND')
worker_concurrency = int(os.getenv('CELERY_WORKER_CONCURRENCY', '1'))
