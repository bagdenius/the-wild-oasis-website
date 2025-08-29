'use client';

import { useFormStatus } from 'react-dom';

import SpinnerMini from './SpinnerMini';

export default function SubmitButton({ children }) {
  const { pending } = useFormStatus();

  return (
    <button
      className='relative bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 cursor-pointer'
      disabled={pending}
    >
      <span className={pending ? 'invisible' : ''}>{children}</span>
      {pending && (
        <span className='absolute inset-0 flex items-center justify-center'>
          <SpinnerMini />
        </span>
      )}
    </button>
  );
}
