'use server';

export async function submit(_currentState: unknown, formData: FormData) {
    try {
      console.log('credentials', _currentState, formData)
    } catch (error) {
      if (error) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.'
          default:
            return 'Something went wrong.'
        }
      }
      throw error
    }
  }
