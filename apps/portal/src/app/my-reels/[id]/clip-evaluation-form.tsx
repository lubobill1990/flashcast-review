import React, { useCallback } from "react";
import { ClipEvaluation } from "@flashcast/db";
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

import { submitClipEvaluation } from "./actions";
import { useUserData } from "@/app/user-data-provider";

type IClipEvaluationFormProps = {
  clipId: number;
  evaluation?: ClipEvaluation;
};
export function ClipEvaluationForm({
  clipId,
  evaluation,
}: IClipEvaluationFormProps) {
  const { id: userId } = useUserData();
  const submitEvaluation = useCallback(
    (score?: number, comment?: string) => {
      submitClipEvaluation(clipId, userId, score, comment);
    },
    [clipId, userId]
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
            <DialogTitle>Give feedback on this reel</DialogTitle>
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
                placeholder="What do you like about this reel? What do you think can be improved?"
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
