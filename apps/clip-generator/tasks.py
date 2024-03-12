from celery import Celery
import requests

# Initialize Celery
celery = Celery('tasks', backend='redis://localhost:6379/0', broker='redis://localhost:6379/0')

def getValue(dictionary, key_string):
    keys = key_string.split('.')
    value = dictionary
    for key in keys:
        value = value.get(key)
        if value is None:
            return None
    return value

# Define a Celery task
@celery.task
def process_video(params):
    jobId = params.get('jobId')
    sampleId = params.get('sampleId')
    experimentId = params.get('experimentId')
    parameters = params.get('parameters')
    videoFile = params.get('videoFile')
    transcriptionFile = params.get('transcriptionFile')
    aiNotes = params.get('aiNotes')
    createdAt = params.get('createdAt')
    webhooks = params.get('webhooks')
    update_status_url = getValue(webhooks, 'onStatusChange.url')
    print(update_status_url, webhooks)
    requests.post(update_status_url, json={"status": "queued"})

    # Simulate video processing
    # You can put your actual video processing logic here
    return f"Video processed: {jobId}"
