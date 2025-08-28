import SignInButton from '@/app/_components/SignInButton';

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className='flex flex-col gap-10 mt-10 items-center'>
      <h2 className='text-3xl font-semibold'>
        Sign in to access your guest area and book a cabin
      </h2>
      <SignInButton />
    </div>
  );
}
