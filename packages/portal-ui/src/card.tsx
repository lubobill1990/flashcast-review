"use client";

import React from "react";
import {
  makeStyles,
  mergeClasses,
  shorthands,
} from "@fluentui/react-components";
import Link from "next/link";
import { FluentIcon } from "@fluentui/react-icons/lib/fonts";
import { VideoClipMultipleIcon, VideoClipWandIcon } from "./icons";

const useStyles = makeStyles({
  header: {
    minHeight: "50px",
    maxHeight: "50px",
    display: "flex",
    fontSize: "14px",
    ...shorthands.padding(0, "34px"),
    ...shorthands.borderBottom("1px", "solid", "rgba(0, 0, 0, .1)"),
  },
  tab: {
    ...shorthands.padding("18px", "10px", "8px"),
  },
  activeTab: {
    fontWeight: "bold",
    ...shorthands.borderBottom("3px", "solid", "#5B5FC7"),
  },
  container: {
    ...shorthands.padding("15px", "34px"),
  },
});

interface IMainPageCardProps extends React.PropsWithChildren {
  activePage: "start_generating" | "my_reels";
}

export const MainPageCard: React.FC<IMainPageCardProps> = ({
  activePage,
  children,
}) => {
  const classes = useStyles();
  return (
    <div
      className="rounded-lg bg-[#ffffffdd]"
      style={{
        filter: "drop-shadow(4px 4px 20px rgba(128, 132, 255, 0.2))",
      }}
    >
      <div className={classes.header}>
        <TabLink
          href="/start-generating"
          active={activePage === "start_generating"}
          Icon={VideoClipWandIcon}
          title={"Start generating"}
        />
        <TabLink
          href="/my-reels"
          active={activePage === "my_reels"}
          Icon={VideoClipMultipleIcon}
          title={"My reels"}
        />
      </div>
      <div className={classes.container}>{children}</div>
    </div>
  );
};

const TabLink: React.FC<{
  href: string;
  active: boolean;
  Icon: FluentIcon;
  title: string;
}> = ({ href, active, Icon, title }) => {
  const classes = useStyles();
  return (
    <Link
      href={href}
      className={mergeClasses(classes.tab, active && classes.activeTab)}
      style={{ marginRight: "5px" }}
    >
      <Icon
        filled={active}
        style={{
          marginRight: "8px",
          color: active ? "#5B5FC7" : "#424242",
        }}
      />
      {title}
    </Link>
  );
};
