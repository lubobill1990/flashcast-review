import React, { useCallback } from "react";
import { SampleOutputEvaluation } from "@prisma/client";
import { Rating } from "@fluentui/react-rating-preview";

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
  Toaster,
  useId,
  useToastController,
  Toast,
  ToastTitle,
} from "@fluentui/react-components";
import { submitSampleOutputEvaluation } from "./actions";

type ISampleOutputEvaluationFormProps = {
  sampleOutputId: number;
  userId: number;
  evaluation?: SampleOutputEvaluation;
};

export function SampleOutputEvaluationForm({
  sampleOutputId,
  userId,
  evaluation,
}: ISampleOutputEvaluationFormProps) {
  const submitEvaluation = useCallback(
    (score?: number, comment?: string) => {
      submitSampleOutputEvaluation(sampleOutputId, userId, score, comment);
    },
    [sampleOutputId, userId]
  );
  const [comment, setComment] = React.useState<string>();
  const [open, setOpen] = React.useState(false);
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const notify = () =>
    dispatchToast(
      <Toast>
        <ToastTitle>Thanks for providing feedback!</ToastTitle>
      </Toast>,
      { intent: "success" }
    );
  return (
    <div className="flex flex-col gap-2 items-end">
      <Rating
        defaultValue={evaluation?.score}
        name="score"
        size="large"
        onChange={(_e, data) => {
          submitEvaluation(data.value);
        }}
      ></Rating>
      <Toaster toasterId={toasterId} position="top-end" />

      <Dialog open={open} onOpenChange={(event, data) => setOpen(data.open)}>
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
                  notify();
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
