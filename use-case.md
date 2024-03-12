# Use cases

## Use case 1: User logs in `P0` `Bo`

User should be able to log in using their Microsoft Azure AD account.

When user clicks on the login button, they should be redirected to the Microsoft Azure AD login page.

After successful login, user should be redirected back to the application and be able to see their profile information.

## Use case 2: Block any feature and page before login `P0` `Bo`

User should only see a blank page with a login button if they are not logged in.

## Use case 3: Submit a sample `P2`

User should be able to submit a sample to the server.

A sample contains:

1. the video file
2. the transcription file
3. the AI notes text
4. a is public flag.

If a sample is public, it can be viewed by anyone. If it is private, it can only be viewed by the administrator and the user who submitted it.

When user clicks on the submit button, the sample data should be persisted to the server.

## Use case 4: View the sample list `P2`

User should be able to view a sample list with public samples and the samples they have submitted.

## Use case 5: View the sample details `P2`

User should be able to view the details of a sample. The details include the video file, the transcription file, the AI notes text, the is public flag, and the submitter information.

## Use case 6: Update the sample `P3`

User should be able to update the sample they have submitted.

When user clicks on the update button, the sample data should be updated on the server.

## Use case 7: delete the sample `P4`

User should be able to delete the sample they have submitted.

When user clicks on the delete button, the sample data should be deleted from the server.

When deleting the sample, the video file, the transcription file, and the AI notes text should also be deleted from the server.

When deleting the sample, the experiment sample, the clips data, clips video generated from the sample, and clip evaluations should also be deleted from the server.

## Use case 8: View the experiment list `P2`

User should be able to view all experiment list with public experiments and the experiments they have submitted.

## Use case 9: Submit an experiment `P4`

User should be able to submit an experiment to the server.

The submit form allows to edit:

1. the experiment name
2. the experiment description, optional
3. the is public flag, the default is true
4. the samples selected to be processed in the experiment

## Use case 10: View the experiment details `P3`

User should be able to view the details of an experiment.

The details include:

1. the experiment name
2. the experiment description
3. the is public flag
4. the submitter information
5. the status of the experiment
6. the samples selected to be processed in the experiment
7. the experiment samples result generated in the experiment

## Use case 11: Update the experiment `P4`

User should be able to update the experiment they have submitted.

When user clicks on the update button, the experiment data should be updated on the server.

User CANNOT update the experiment after the experiment has been processed.

## Use case 12: Delete the experiment `P4`

User should be able to delete the experiment they have submitted.

When user clicks on the delete button, the experiment data should be deleted from the server.

When deleting the experiment, the experiment samples result, video clips, clip evaluations generated in the experiment should also be deleted from the server.

## Use case 13: Trigger the experiment processing `P2`

User should be able to trigger the experiment processing.

When user clicks on the trigger button, the experiment data should be processed on the server, the status should be updated to requested.

User CANNOT trigger the experiment processing if the experiment has already been processed.

When user triggers the experiment processing, the backend sends a request to the clip generating service, with endpoints with token to:

1. access the video file, the transcription file, the AI notes text of the samples selected to be processed in the experiment
2. update the experiment status
3. update the experiment samples result, adding the clips data and the clips video generated from the sample

## Use case 14: View the experiment samples result list `P0`

User should be able to view the experiment samples result list of public experiments or the experiment submitted by the user.

The experiment samples result list contains the experiment name, process start time, process end time, evaluation count, generated clips count.

## Use case 15: Evaluate the experiment samples result details `P0`

User should be able to view the details of an experiment samples result.

The details include:

1. the experiment name and ID with a link to the experiment details
2. the sample name and ID with a link to the sample details
3. the video file of the sample
4. the transcription file of the sample
5. the AI notes text of the sample
6. the video clips generated from the sample
   1. evaluation forms to input score and comment for each video clips
7. a evaluation form to input score and comment for the video clips

If the user has already evaluated the video clips, the evaluation forms should be pre-filled with the user's previous evaluation. In this case, the user should update the evaluation rather than creating a new one.

The evaluation is submitted instantly when user input the score and comment.

There should be no submit button for the evaluation form.

Go to the next evaluation.
