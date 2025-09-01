import DateSelector from './DateSelector';
import LoginMessage from './LoginMessage';
import ReservationForm from './ReservationForm';

import { auth } from '@/app/_lib/auth';
import { getBookedDatesByCabinId, getSettings } from '@/app/_lib/data-service';

export default async function Reservation({ cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  const session = await auth();

  return (
    <div className='grid grid-cols-2 border border-primary-800 min-h-[400px]'>
      <DateSelector
        cabin={cabin}
        settings={settings}
        bookedDates={bookedDates}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}
