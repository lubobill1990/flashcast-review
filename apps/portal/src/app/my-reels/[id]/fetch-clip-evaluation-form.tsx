import * as React from "react";
import { z } from "zod";
import fs from "fs";
import { Field } from "portal-ui";
import { Checkbox, Input } from "@fluentui/react-components";

const MultipleChoiceQuestion = z.object({
  id: z.number(),
  type: z.enum(["multiple_choice"]),
  question: z.string(),
  required: z.boolean(),
  hint: z.string().optional(),
  options: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
      isOpen: z.boolean().optional(),
    })
  ),
});
type IMultipleChoiceQuestion = z.infer<typeof MultipleChoiceQuestion>;
const OpenAnswerQuestion = z.object({
  id: z.number(),
  type: z.enum(["open_answer"]),
  question: z.string(),
  required: z.boolean(),
  hint: z.string().optional(),
});
type IOpenAnswerQuestion = z.infer<typeof OpenAnswerQuestion>;
const ClipEvaluationForm = z.object({
  type: z.enum(["clip_evaluation_positive", "clip_evaluation_negative"]),
  questions: z.array(z.union([MultipleChoiceQuestion, OpenAnswerQuestion])),
});
type IClipEvaluationForm = z.infer<typeof ClipEvaluationForm>;

const ClipEvaluationPositiveForm: React.FC = () => {
  const form = ClipEvaluationForm.parse(
    JSON.parse(
      fs.readFileSync(
        process.cwd() + "/src/asset/clip-evaluation-positive-form.json",
        "utf8"
      )
    )
  );
  return (
    <div>
      <h1>Provide feedback to this reel</h1>
      <form>
        {form.questions.map(question => (
          <></>
        ))}
      </form>
    </div>
  );
};

const MultipleChoicesField: React.FC<{
  questionDetail: IMultipleChoiceQuestion;
}> = ({ questionDetail }) => {
  const [choices, setChoices] = React.useState<{ id: number; value: string }[]>(
    []
  );
  return (
    <Field label={questionDetail.question} required={questionDetail.required}>
      {questionDetail.options.map(option => (
        <Checkbox
          key={option.id}
          label={
            option.isOpen ? <Input placeholder={option.text} /> : option.text
          }
          checked={choices.some(choice => choice.id === option.id)}
          onChange={(_, checked) => {
            if (checked) {
              setChoices([...choices, { id: option.id, value: option.text }]);
            } else {
              setChoices(choices.filter(choice => choice.id !== option.id));
            }
          }}
        ></Checkbox>
      ))}
    </Field>
  );
};
