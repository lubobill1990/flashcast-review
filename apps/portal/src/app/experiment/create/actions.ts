'use server';

import { auth } from "@flashcast/auth";

export async function submit(_currentState: unknown, formData: FormData) {
  const session = await auth();
  console.log({
    session,
    _currentState,
    name: formData.get('name'),
    description: formData.get('description'),
    parameters: formData.get('parameters'),
  });

  return {
    id: 123,
    errors: {},
  };
}
