"use client";

import { Button, Tag } from "@fluentui/react-components";
// import {} from '@fluentui/react-icons';
import Link from "next/link";
import React from "react";

interface IReelsCollectionProps extends React.PropsWithChildren {
  status: string;
  title: string;
  clipThumnails: string[];
  createdDate: string;
  url: string;
}
export const ReelsCollection: React.FC<IReelsCollectionProps> = ({
  status,
  title,
  clipThumnails,
  createdDate,
  url,
}) => {
  const clipUrl =
    "https://flashcastreview.blob.core.windows.net/samples/4691e320-2f5a-4cc2-9302-962281bfb0cd.sample.mp4";
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "14px" }}>
          <strong>{clipThumnails.length} Reels</strong>
          {" generated from "}
          <strong>{title}</strong>
          <Tag
            style={{
              marginLeft: "8px",
              background: "#13A10E",
              borderRadius: "4px",
              color: "#FFFFFF",
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
          {clipThumnails.map(_ => (
            <li key={clipUrl} style={{ float: "left", marginRight: "8px" }}>
              <video
                className="w-[60px] aspect-[9/16] rounded-md"
                src={clipUrl}
              ></video>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
