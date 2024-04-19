import React from "react";
import { toInteger } from "lodash-es";

import { SampleOutputDetails } from "./sample-output-details";
import { getUserSampleOutputById } from "./actions";
import { ActionButton } from "./action-button";

type Params = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Params) {
  const sampleOutputId = toInteger(id);

  const sampleOutput = await getUserSampleOutputById(sampleOutputId);

  return (
    <div>
      {sampleOutput ? (
        <SampleOutputDetails sampleOutput={sampleOutput}></SampleOutputDetails>
      ) : (
        <div>Reels unavailable</div>
      )}

      {sampleOutput.status === "created" && (
        <ActionButton sampleOutputId={sampleOutput.id} />
      )}
    </div>
  );
}
