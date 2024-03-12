import { PrismaClient, Sample } from "@prisma/client";
import { getServerSession } from "next-auth";

export class SampleService {
    constructor(private prisma: PrismaClient) {

    }

    async createSample(data: { recording: File, transcription: File, notes: string }, isPublic = true): Promise<Sample> {
        const session = await getServerSession();
        
        // find the user by email
        const user = await this.prisma.user.findFirst({
            where: {
                email: session?.user?.email || "",
            },
        });
        
        if (!user) throw new Error("User not found");
        
        // upload file to cloud storage, and get back urls 
        const recordingUrl = "";
        const transcriptionUrl = "";
        // save the sample to the database
        const sample = await this.prisma.sample.create({
            data: {
                data: {
                    recording: recordingUrl,
                    transcription: transcriptionUrl,
                    notes: data.notes,
                },
                isPublic,
                userId: user?.id,
            },
        });

        console.log(sample);
        return sample;
    }

    async getSamples(): Promise<Sample[]> {
        const session = await getServerSession();
        const user = await this.prisma.user.findFirst({
            where: {
                email: session?.user?.email || "",
            },
        });
        if (!user) throw new Error("User not found");
        const samples = await this.prisma.sample.findMany({
            where: {
                userId: user.id,
            },
        });
        return samples;
    }
}