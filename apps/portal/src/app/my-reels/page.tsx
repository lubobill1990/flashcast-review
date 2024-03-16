import Link from "next/link";
import Branding from "../branding";
import factory from "@/factory";
import { Divider, MainPageCard, ReelsCollection } from "portal-ui";

type ClipData =
  | {
      clipUrl?: string;
      thumnailUrl?: string;
    }
  | null
  | undefined;

type SampleData =
  | {
      recordingTitle: string;
    }
  | null
  | undefined;

export default async function Page() {
  const user = await factory.userService.getUser();
  const sampleOutputs =
    await factory.sampleOutputService.getSampleOutputsByUserId(user.id);

  return (
    <>
      <Branding />
      <MainPageCard activePage="my_reels">
        {sampleOutputs ? (
          <ul>
            {sampleOutputs.map((sampleOutput, index, arr) => (
              <>
                <li key={sampleOutput.id}>
                  <ReelsCollection
                    status={sampleOutput.status}
                    title={
                      (sampleOutput.sample.data as SampleData)
                        ?.recordingTitle || ""
                    }
                    clipThumnails={sampleOutput.clips.map(
                      clip => (clip.data as ClipData)?.clipUrl || ""
                    )}
                    createdDate={sampleOutput.createdAt.toLocaleString()}
                    url={`/my-reels/${sampleOutput.id}`}
                  />
                </li>
                {index !== arr.length - 1 && (
                  <Divider style={{ margin: "24px 0" }} />
                )}
              </>
            ))}
          </ul>
        ) : (
          <p>No reels</p>
        )}
      </MainPageCard>
    </>
  );
}
