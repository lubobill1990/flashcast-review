"use client";

import React, { FC, useState } from "react";
import { mergeClasses } from "@fluentui/react-components";

import { Tab, TabList } from "@fluentui/react-components";

import PlayIcon from "./play.svg";

import { SampleOutput } from "./actions";
import { ClipEvaluationForm } from "./clip-evaluation-form";
import { SampleOutputEvaluationForm } from "./sample-output-evaluation-form";
import { ExperimentTabContent } from "./experiment-tab-content";

export const SampleOutputDetails: FC<{
  sampleOutput: SampleOutput;
}> = ({ sampleOutput }) => {
  const { sample } = sampleOutput;
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);
  const selectedClip = sampleOutput.clips[selectedClipIndex];
  const clipVideoUrl = selectedClip?.videoUrl;

  const [tab, setTab] = useState("tab1");

  return (
    <>
      <div className="flex">
        {/* {clipVideoUrl && (
          <div className="w-[30%]">
            <video
              className="aspect-[9/16] rounded-lg"
              controls
              src={clipVideoUrl}
            ></video>
          </div>
        )} */}
        <div className="flex-1 ml-3 bg-[#ffffffcc] rounded-lg shadow-lg">
          <div className="flex p-4">
            <div className="flex flex-col flex-1">
              <h1>
                <span className="font-bold">
                  {sampleOutput.clips.length} Reels
                </span>{" "}
                generated from {sample.id}
              </h1>
              <div>{sampleOutput.createdAt.toLocaleDateString()}</div>
              <p>
                {sampleOutput.sample.isPublic
                  ? "Generated reels is public to everyone."
                  : "Generated reels are only visible to you."}
              </p>
            </div>
            <div>
              <SampleOutputEvaluationForm
                sampleOutputId={sampleOutput.id}
                evaluation={sampleOutput.evaluations[0]}
              />
            </div>
          </div>

          <TabList
            className="px-4 broder-b border-[#E0E0E0] border-b-2"
            selectedValue={tab}
            onTabSelect={(e, data) => {
              setTab(data.value as string);
            }}
          >
            <Tab value="tab1">Generated reels</Tab>
            <Tab value="tab2">Uploaded artifacts</Tab>
          </TabList>
          {tab === "tab1" && (
            <div>
              <ul>
                {sampleOutput.clips.map((clip, i) => (
                  <li
                    className={mergeClasses(
                      selectedClip.id === clip.id && "bg-[#E8EBFA]",
                      "flex items-center py-2 px-4 gap-3",
                      i !== 0 && "border-t border-[#F0F0F0]"
                    )}
                    key={clip.id}
                  >
                    <div>
                      <button
                        className="w-10 h-10 flex items-center justify-center"
                        onClick={() => setSelectedClipIndex(i)}
                      >
                        <PlayIcon></PlayIcon>
                      </button>
                    </div>
                    <div>
                      <video
                        className="w-[52px] aspect-[9/16] rounded-md"
                        src={clip.videoUrl}
                      ></video>
                    </div>
                    <div className="flex-1">
                      {clip.headline ?? "Executive summary reel"}
                    </div>

                    <ClipEvaluationForm
                      clipId={clip.id}
                      evaluation={clip.evaluations[0]}
                    />
                  </li>
                ))}
                {sampleOutput.clips.length === 0 && (
                  <div className="p-6">Generating...</div>
                )}
              </ul>
            </div>
          )}
          {tab === "tab2" && (
            <ExperimentTabContent
              sample={sampleOutput.sample}
            ></ExperimentTabContent>
          )}
        </div>
      </div>
    </>
  );
};
