import { NextRequest, NextResponse } from "next/server";
import { getSampleOutputOrThrow } from "../sample-output-api-util";
import { prisma, type IClipScore } from "@flashcast/db";
import { z } from "zod";
// import fs from "fs";

const ClipRequest = z.object({
  headline: z.string().min(1),
  description: z.string().optional(),
  duration: z.number(),
  tags: z.string().array(),
  startTime: z.number(),
  endTime: z.number().min(0),
  storagePath: z.string().url().min(1),
  payload: z.string().optional(),
  scores: z
    .object({
      FinalNorm: z.number(),
      IntensityNorm: z.number().optional(),
      IntensityReason: z.string().optional(),
      InsightfulNorm: z.number().optional(),
      InsightfulReason: z.string().optional(),
      RelevancyNorm: z.number().optional(),
      RelevancyReason: z.string().optional(),
    })
    .optional(),
});

// TODO: uncomment this when the score-mapper.json is ready for production
// const ClipScoreMapper = z.object({
//   score: z.string(),
//   dimensions: z
//     .object({
//       type: z.string(),
//       score: z.string(),
//       reason: z.string(),
//     })
//     .array(),
// });
// const clipScoreMapperJson = JSON.parse(
//   fs.readFileSync(process.cwd() + "/src/asset/score-mapper.json", "utf8")
// );
// const clipScoreMapper = ClipScoreMapper.parse(clipScoreMapperJson);

const clipScoreMapper = {
  score: "FinalNorm",
  dimensions: [
    {
      type: "intensity",
      score: "IntensityNorm",
      reason: "IntensityReason",
    },
    {
      type: "insightful",
      score: "InsightfulNorm",
      reason: "InsightfulReason",
    },
    {
      type: "relevancy",
      score: "RelevancyNorm",
      reason: "RelevancyReason",
    },
  ],
};

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const token = req.nextUrl.searchParams.get("token");
  console.log("[DEBUG] POST /api/sample-output/[id]/clip");
  console.log("request", req);

  if (!token) {
    return NextResponse.error();
  }

  try {
    const reqData = await req.json();
    const clipData = ClipRequest.parse(reqData);
    console.log("clipData", clipData);

    const sampleOutput = await getSampleOutputOrThrow(id, token);

    const rawScores = clipData.scores;
    const scores: IClipScore | undefined = rawScores && {
      score: rawScores[clipScoreMapper.score] as number,
      dimensions: clipScoreMapper.dimensions
        .map(dimension => {
          const score = rawScores[dimension.score];
          const reason = rawScores[dimension.reason];

          if (score && reason) {
            return {
              type: dimension.type,
              score: rawScores[dimension.score] as number,
              reason: rawScores[dimension.reason] as string,
            };
          }
        })
        .filter(dimension => !!dimension) as IClipScore["dimensions"],
    };

    await prisma.clip.create({
      data: {
        videoUrl: clipData.storagePath,
        headline: clipData.headline,
        description: clipData.description,
        duration: clipData.duration,
        tags: clipData.tags,
        startTime: clipData.startTime,
        endTime: clipData.endTime,
        scores: scores,
        payload: clipData.payload,
        data: {},
        sampleOutput: {
          connect: {
            id: sampleOutput.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.error();
  }
}
