## Use case 13: Trigger the experiment processing `P2`

User should be able to trigger the experiment processing.

>> a function, given the experiment_id, user_id

When user clicks on the trigger button, the experiment data should be processed on the server, the status should be updated to requested.

> check if the experiment has already been processed
> if not, get all samples selected to be processed in the experiment
> for each sample:
>> create sample output to receive generation result
>> prepare video file, transcription file, AI notes text
>> send to the clip generating service with webhook to update the sample output's status, adding the clips data and the clips video generated from the sample
>> update the sample output's status to requested

User CANNOT trigger the experiment processing if the experiment has already been processed.

When user triggers the experiment processing, the backend sends a request to the clip generating service, with endpoints with token to:

1. access the video file, the transcription file, the AI notes text of the samples selected to be processed in the experiment
2. update the experiment status
3. update the experiment samples result, adding the clips data and the clips video generated from the sample
