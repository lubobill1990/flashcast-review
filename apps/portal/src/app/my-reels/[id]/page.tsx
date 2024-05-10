import React from "react";
import { toInteger } from "lodash-es";

import { SampleOutputDetails } from "./sample-output-details";
import { getUserSampleOutputById } from "./actions";
import { useUserData } from "@/app/user-data-provider";

type Params = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Params) {
  const sampleOutputId = toInteger(id);
  const { id: userId } = useUserData();

  const sampleOutput = await getUserSampleOutputById(sampleOutputId, userId);

  return (
    <div>
      {sampleOutput ? (
        <SampleOutputDetails sampleOutput={sampleOutput}></SampleOutputDetails>
      ) : (
        <div>Reels unavailable</div>
      )}
    </div>
  );
}
