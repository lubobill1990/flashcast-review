import React, { useCallback } from "react";
import { debounce } from "lodash-es";
import { SampleOutputEvaluation } from "@prisma/client";
import { Rating } from "@fluentui/react-rating-preview";
import { Textarea } from "@fluentui/react-components";

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
  const submitEvaluationDebounced = useCallback(
    debounce((score?: number, comment?: string) => {
      submitSampleOutputEvaluation(sampleOutputId, userId, score, comment);
    }, 1000),
    [sampleOutputId, userId]
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
        placeholder="What do you like about this reel? What do you think can be improved?"
        onChange={e => {
          submitEvaluationDebounced(undefined, e.target.value);
        }}
      />
    </div>
  );
}
