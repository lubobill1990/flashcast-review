'use server'

import factory from "@/factory";

export async function getSampleOutput(id: number) {
  return factory.sampleOutputService.getSampleOutput(id);
}

export async function getSample(id: number) {
    return factory.sampleService.getSample(id);
  }