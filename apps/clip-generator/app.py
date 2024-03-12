# app.py

from flask import Flask, request, jsonify
from jsonschema import validate
from tasks import process_video

# Initialize Flask app
app = Flask(__name__)


schema = {
    "type": "object",
    "properties": {
        "jobId": {
            "type": "string"
        },
        "sampleId": {
            "type": "number"
        },
        "experimentId": {
            "type": "number"
        },
        "parameters": {
            "type": "object"
        },
        "videoFile": {
            "type": "object"
        },
        "transcriptionFile": {
            "type": "object"
        },
        "aiNotes": {
            "type": "string"
        },
        "createdAt": {
            "type": "string"
        },
        "webhooks": {
            "type": "object",
        }
    },
}

# Define a route to submit video processing tasks
@app.route('/api/process-video', methods=['POST'])
def submit_video_task():
    video_url = request.json.get('video_url')
    params = request.json
    try:
        validate(instance=params, schema=schema)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    # Submit the video processing task to Celery
    task = process_video.delay(params)
    
    return jsonify({'task_id': task.id}), 200


# Define a route to check the status of a task
@app.route('/task-status/<task_id>', methods=['GET'])
def get_task_status(task_id):
    task = process_video.AsyncResult(task_id)

    if task.state == 'PENDING':
        status = 'Pending'
    elif task.state == 'SUCCESS':
        status = 'Success'
    elif task.state == 'FAILURE':
        status = 'Failure'
    else:
        status = 'Unknown'

    return jsonify({'task_status': status}), 200


if __name__ == '__main__':
    app.run(debug=True)
