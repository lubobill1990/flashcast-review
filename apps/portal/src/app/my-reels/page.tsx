import Branding from "../branding";
import factory from "@/factory";
import { Divider, MainPageCard, ReelsCollection } from "portal-ui";

export default async function Page() {
  const user = await factory.userService.getUser();
  const sampleOutputs =
    await factory.sampleOutputService.getSampleOutputsByUserId(user.id);
  sampleOutputs.forEach(sampleOutput => {
    sampleOutput.clips.forEach(clip => {
      clip.videoUrl = factory.azureBlobSASService.generateReadOnlySasUrl(
        clip.videoUrl
      );
    });
  });

  return (
    <>
      <Branding />
      <MainPageCard activePage="my_reels">
        {sampleOutputs.length > 0 ? (
          <ul>
            {sampleOutputs.map((sampleOutput, index, arr) => (
              <>
                <li key={sampleOutput.id}>
                  <ReelsCollection
                    sampleOutput={sampleOutput}
                    sample={sampleOutput.sample}
                    clips={sampleOutput.clips}
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
