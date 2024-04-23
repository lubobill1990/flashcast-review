"use client";

import { Button, Tag } from "@fluentui/react-components";
import Link from "next/link";
import React from "react";
import { Clip, Sample, SampleOutput } from "@flashcast/db";

export const ReelsCollection: React.FC<{
  sampleOutput: SampleOutput;
  sample: Sample;
  clips: Clip[];
}> = ({ sampleOutput, sample, clips }) => {
  const status = sampleOutput.status;
  const title = sample.meetingTitle || "";

  const createdDate = sampleOutput.createdAt.toLocaleString();
  const url = `/my-reels/${sampleOutput.id}`;

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "14px" }}>
          <strong>{clips.length} Reels</strong>
          {" generated from "}
          <strong>{title}</strong>
          <Tag
            style={{
              marginLeft: "8px",
              background:
                status === "completed"
                  ? "#13A10E"
                  : status === "error"
                  ? "#FF0000"
                  : "#EBEBEB",
              borderRadius: "4px",
              color:
                status === "completed" || status === "error"
                  ? "#FFFFFF"
                  : "#616161",
              fontSize: "10px",
              fontWeight: 600,
            }}
          >
            {status}
          </Tag>
        </div>
        <div style={{ fontSize: "10px", color: "#424242" }}>{createdDate}</div>
        <div style={{ marginTop: "18px" }}>
          <Link href={url}>
            <Button>View all</Button>
          </Link>
        </div>
      </div>
      <div>
        <ul>
          {clips.map(clip => (
            <li key={clip.id} style={{ float: "left", marginRight: "8px" }}>
              <video
                className="w-[60px] aspect-[9/16] rounded-md"
                src={clip.videoUrl}
              ></video>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
