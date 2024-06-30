"use client";

import * as React from "react";
import { ClipEvaluation } from "@flashcast/db";
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Link,
} from "@fluentui/react-components";

import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";

import { submitClipEvaluation } from "./actions";
import {
  Dismiss24Regular,
  ThumbLikeRegular,
  ThumbLikeFilled,
  ThumbDislikeRegular,
  ThumbDislikeFilled,
} from "portal-ui";

export const ClipEvaluationForm: React.FC<{
  clipId: number;
  evaluation?: ClipEvaluation;
}> = ({ clipId, evaluation }) => {
  const evaluationData = evaluation?.data as any;

  const [feedbackProvided, setFeedbackProvided] = React.useState(!!evaluation);
  const [feedbackType, setFeedbackType] = React.useState<
    "positive" | "negative" | undefined
  >(evaluationData?.type);
  const [feedbackFormProvided, setFeedbackFormProvided] =
    React.useState<boolean>(!!evaluationData?.formdata);

  const [openPositiveFeedbackDialog, setOpenPositiveFeedbackDialog] =
    React.useState(false);
  const [openNegativeFeedbackDialog, setOpenNegativeFeedbackDialog] =
    React.useState(false);

  const handlePositiveButtonClick = () => {
    submitClipEvaluation(clipId, "positive").then(() => {
      setFeedbackType("positive");
      setFeedbackProvided(true);
      setOpenPositiveFeedbackDialog(true);
    });
  };

  const handleNegativeButtonClick = () => {
    submitClipEvaluation(clipId, "negative").then(() => {
      setFeedbackType("negative");
      setFeedbackProvided(true);
      setOpenNegativeFeedbackDialog(true);
    });
  };

  const handleSubmitForm = (type: "positive" | "negative", formdata: any) => {
    submitClipEvaluation(clipId, type, formdata).then(() => {
      setFeedbackFormProvided(true);
    });
  };

  const tip = feedbackProvided ? (
    <>
      Thank you for your feedback!{" "}
      {!feedbackFormProvided && (
        <Link
          style={{
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "22px",
            color: "#4F52B2",
          }}
          onClick={() =>
            feedbackType === "positive"
              ? setOpenPositiveFeedbackDialog(true)
              : setOpenNegativeFeedbackDialog(true)
          }
        >
          Care to tell us why?
        </Link>
      )}
    </>
  ) : (
    "What do you think about this reel?"
  );

  return (
    <div className="flex justify-end items-center">
      <span className="font-[600] text-[20px] leading-[22px] text-[#242424]">
        {tip}
      </span>
      <Button
        appearance="transparent"
        icon={
          feedbackType === "positive" ? (
            <ThumbLikeFilled />
          ) : (
            <ThumbLikeRegular />
          )
        }
        size="large"
        onClick={handlePositiveButtonClick}
        disabled={feedbackProvided}
      />
      <Button
        appearance="transparent"
        icon={
          feedbackType === "negative" ? (
            <ThumbDislikeFilled />
          ) : (
            <ThumbDislikeRegular />
          )
        }
        size="large"
        onClick={handleNegativeButtonClick}
        disabled={feedbackProvided}
      />
      <ClipEvaluationPositiveForm
        open={openPositiveFeedbackDialog}
        setOpen={setOpenPositiveFeedbackDialog}
        onSubmit={handleSubmitForm}
      />
      <ClipEvaluationNegativeForm
        open={openNegativeFeedbackDialog}
        setOpen={setOpenNegativeFeedbackDialog}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
};

interface IFeedbackFormProps {
  open: boolean;
  setOpen: (newOpen: boolean) => void;
  onSubmit: (type: "positive" | "negative", formdata: any) => void;
}

const positiveFormJson = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "checkbox",
          name: "What did you like? (Select all that apply)",
          isRequired: true,
          choices: [
            "The overall score (ranking) of this reel is appropriate.",
            "The reel's title and description accurately reflect the content.",
            "The extracted content is valuable and helpful.",
            "The reel's presentation is enjoyable.",
          ],
          showOtherItem: true,
          otherText: "Other reasons",
        },
        {
          type: "comment",
          name: "Any other feedback to help us improve?",
          placeholder: "Summarize your feedback",
        },
      ],
    },
  ],
};
export const ClipEvaluationPositiveForm: React.FC<IFeedbackFormProps> = ({
  open,
  setOpen,
  onSubmit,
}) => {
  const survey = new Model(positiveFormJson);

  survey.onComplete.add((sender, options) => {
    options.showSaveInProgress();
    console.log(sender.data);
    onSubmit("positive", sender.data);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        setOpen(data.open);
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button
                  appearance="subtle"
                  aria-label="close"
                  icon={<Dismiss24Regular />}
                />
              </DialogTrigger>
            }
          >
            Provide feedback to this reel
          </DialogTitle>
          <DialogContent>
            <Survey model={survey} />
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

const negativeFormJson = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "checkbox",
          name: "What did you like? (Select all that apply)",
          isRequired: true,
          choices: [
            "The overall score (ranking) of this reel could be higher.",
            "The overall score (ranking) of this reel could be lower.",
            "The reel's title or description is inaccurate.",
            "The extracted content lacks engagement or insight.",
            "The visualization (e.g., background style, layout) is unappealing.",
          ],
          showOtherItem: true,
          otherText: "Other reasons",
        },
        {
          type: "comment",
          name: "Any other feedback to help us improve?",
          placeholder: "Summarize your feedback",
        },
      ],
    },
  ],
};
export const ClipEvaluationNegativeForm: React.FC<IFeedbackFormProps> = ({
  open,
  setOpen,
  onSubmit,
}) => {
  const survey = new Model(negativeFormJson);

  survey.onComplete.add((sender, options) => {
    options.showSaveInProgress();
    console.log(sender.data);
    onSubmit("negative", sender.data);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        setOpen(data.open);
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <DialogTrigger action="close">
                <Button
                  appearance="subtle"
                  aria-label="close"
                  icon={<Dismiss24Regular />}
                />
              </DialogTrigger>
            }
          >
            Provide feedback to this reel
          </DialogTitle>
          <DialogContent>
            <Survey model={survey} />
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
