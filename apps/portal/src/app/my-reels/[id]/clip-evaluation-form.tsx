import React, { useCallback } from "react";
import { debounce } from "lodash-es";
import { ClipEvaluation } from "@prisma/client";
import { Rating } from "@fluentui/react-rating-preview";
import { Textarea } from "@fluentui/react-components";

import { submitClipEvaluation } from "./actions";

type IClipEvaluationFormProps = {
  clipId: number;
  userId: number;
  evaluation?: ClipEvaluation;
};
export function ClipEvaluationForm({
  clipId,
  userId,
  evaluation,
}: IClipEvaluationFormProps) {
  const submitEvaluationDebounced = useCallback(
    debounce((score?: number, comment?: string) => {
      submitClipEvaluation(clipId, userId, score, comment);
    }, 1000),
    [clipId, userId]
  );
  return (
    <div className="flex flex-col gap-2 items-end">
      <Rating
        defaultValue={evaluation?.score}
        name="score"
        size="large"
        onChange={(_e, data) => {
          submitEvaluationDebounced(data.value);
        }}
      ></Rating>
      <Textarea
        name="comment"
        className="w-[210px]"
        defaultValue={evaluation?.comment || ""}
        onChange={e => {
          submitEvaluationDebounced(undefined, e.target.value);
        }}
      />
    </div>
  );
}
