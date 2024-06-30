import React, { useCallback } from "react";
import { SampleOutputEvaluation } from "@flashcast/db";

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Label,
  Textarea,
} from "@fluentui/react-components";
import { submitSampleOutputEvaluation } from "./actions";

type ISampleOutputEvaluationFormProps = {
  sampleOutputId: number;
  evaluation?: SampleOutputEvaluation;
};

export function SampleOutputEvaluationForm({
  sampleOutputId,
  evaluation,
}: ISampleOutputEvaluationFormProps) {
  const [comment, setComment] = React.useState<string>();
  const [open, setOpen] = React.useState(false);
  const [feedbackProvide, setFeedbackProvide] = React.useState(!!evaluation);

  const submitEvaluation = useCallback(
    (score?: number, comment?: string) => {
      submitSampleOutputEvaluation(sampleOutputId, score, comment).then(() => {
        setFeedbackProvide(true);
      });
    },
    [sampleOutputId]
  );

  if (feedbackProvide) {
    return (
      <div className="font-[600] text-[16px] leading-[22px]">
        Thank you for your feedback!
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 items-end">
      <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
        <DialogTrigger disableButtonEnhancement>
          <Button className="">Give feedback</Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              Give feedback and help us improve AI quality
            </DialogTitle>
            <DialogContent>
              <Label className="mb-1">
                Summarize your feedback <span className="text-red">*</span>
              </Label>
              <Textarea
                name="comment"
                className="w-full min-h-[160px]"
                value={comment ?? (evaluation?.comment || "")}
                onChange={e => {
                  setComment(e.target.value);
                }}
                placeholder="Overall speaking, what do you think about these reels?"
              />
            </DialogContent>
            <DialogActions className="mt-1">
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                disabled={!comment}
                onClick={async () => {
                  await submitEvaluation(undefined, comment);
                  setOpen(false);
                }}
              >
                Submit
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
