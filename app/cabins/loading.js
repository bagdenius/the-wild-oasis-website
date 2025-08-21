import Spinner from '@/app/_components/Spinner';

export default function CabinsLoading() {
  return (
    <div className='grid place-items-center'>
      <Spinner />
      <p className='text-xl text-primary-200'>Loading cabin data...</p>
    </div>
  );
}
