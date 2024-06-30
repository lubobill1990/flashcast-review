"use client";

import React, { FC } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Tag,
} from "@fluentui/react-components";

import { Button } from "@fluentui/react-components";
import { SampleOutput } from "./actions";
import { ClipEvaluationForm } from "./clip-evaluation-form";
import { SampleOutputEvaluationForm } from "./sample-output-evaluation-form";
import { z } from "zod";

const ClipScore = z.object({
  score: z.number().optional(),
  dimensions: z
    .array(
      z.object({
        type: z.string(),
        score: z.number(),
        reason: z.string(),
      })
    )
    .optional(),
});

const ScoreDimensionI18n = {
  intensity: "Intensity",
  insightful: "Insightfulness",
  relevancy: "Topic relevancy",
};
const convertDimension = (dimension: string) =>
  ScoreDimensionI18n[dimension] || dimension;
const convertScore = (score: number) =>
  score >= 90 ? "A" : score >= 70 ? "A-" : score >= 50 ? "B" : "C";

export const SampleOutputDetails: FC<{
  sampleOutput: SampleOutput;
}> = ({ sampleOutput }) => {
  return (
    <div className="flex-col">
      <div className="flex-1 bg-[#ffffffcc] rounded-lg">
        <SampleInformation sampleOutput={sampleOutput} />
      </div>
      <ul>
        {sampleOutput.clips.map((clip, i) => {
          const clipScores = ClipScore.parse(clip.scores);
          return (
            <li
              key={clip.id}
              className="flex-1 mt-[20px] bg-[#ffffffcc] rounded-lg"
            >
              <div className="flex px-[20px] py-[24px]">
                <div className="w-[296px] shrink-0">
                  <video
                    className="w-[296px] aspect-[9/16] rounded-md"
                    src={clip.videoUrl}
                    controls
                  ></video>
                  {/* <div className="flex w-[296px] aspect-[9/16] rounded-md bg-black text-white place-content-around">
                  Mock Video Element
                </div> */}
                </div>
                <div className="flex flex-col ml-[19px] w-full">
                  <h2 className="flex items-center">
                    <span className="text-[22px] font-[600] text-[#242424] leading-[32px] mr-[8px]">
                      #{i + 1} {clip.headline}{" "}
                    </span>
                    <Tag style={{ backgroundColor: "#1F1F1F1A" }}>
                      <span className="font-[700]">
                        {clipScores?.score ?? "-"}
                      </span>
                      /100
                    </Tag>
                  </h2>
                  <p className="text-[18px] font-[400] text-[#212121] ml-[8px] mt-[8px] leading-6">
                    {clip.description}
                  </p>
                  <div className="flex flex-col bg-[#E0E3FF33] mt-[16px] p-[16px] rounded-[8px]">
                    <div className="text-[16px] font-[700] text-[#212121]">
                      Overall Score: {clipScores?.score ?? "-"}
                    </div>
                    <Divider className="my-[12px]" />
                    <div className="flex flex-col space-y-[11px]">
                      {clipScores?.dimensions?.map((dimension, i) => (
                        <div key={i}>
                          <div className="text-[16px] font-[700] text-[#212121]">
                            {convertDimension(dimension.type)}:{" "}
                            {convertScore(dimension.score)}
                          </div>
                          <div className="text-[14px] font-[400] text-[#212121] leading-[21px]">
                            {dimension.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grow" />
                  <div>
                    <ClipEvaluationForm
                      clipId={clip.id}
                      evaluation={clip.evaluations[0]}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const SampleInformation: FC<{
  sampleOutput: SampleOutput;
}> = ({ sampleOutput }) => {
  const { sample } = sampleOutput;
  return (
    <div className="flex p-[20px]">
      <div className="flex flex-col flex-1">
        <h1 className="font-[400] text-[20px] leading-[28px]">
          <span className="font-[600]">{sampleOutput.clips.length} Reels</span>{" "}
          <span>generated from</span>{" "}
          <span className="font-[600] text-[#4F52B2]">
            {sample.meetingTitle}
          </span>
        </h1>
        <div className="font-[400] text-[14px] leading-[16px] text-[#616161] mt-[8px]">
          Generated on{" "}
          {sampleOutput.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        {/* <p>
          {sampleOutput.sample.isPublic
            ? "Generated reels is public to everyone."
            : "Generated reels are only visible to you."}
        </p> */}
        <div className="flex mt-[13px] space-x-[10px]">
          <Button
            appearance="outline"
            href={sample.recordingVideoUrl}
            style={{
              borderColor: "#F0F0F0",
              color: "#000000E4",
              fontSize: "12px",
            }}
          >
            {sample.meetingTitle}
          </Button>
          <Button
            appearance="outline"
            href={sample.transcriptionFileUrl}
            style={{
              borderColor: "#F0F0F0",
              color: "#000000E4",
              fontSize: "12px",
            }}
          >
            Transcript.docx
          </Button>
          <Dialog>
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="outline"
                style={{
                  borderColor: "#F0F0F0",
                  color: "#000000E4",
                  fontSize: "12px",
                }}
              >
                View AI Notes
              </Button>
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>AI Notes</DialogTitle>
                <DialogContent>{(sample.data as any)?.aiNotes}</DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </div>
      </div>
      <div>
        <SampleOutputEvaluationForm
          sampleOutputId={sampleOutput.id}
          evaluation={sampleOutput.evaluations[0]}
        />
      </div>
    </div>
  );
};
