'use client';

import {
  addDays,
  differenceInDays,
  isAfter,
  isBefore,
  isPast,
  isSameDay,
  isWithinInterval,
  subDays,
} from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { useReservationContext } from './ReservationContext';

function isAlreadyBooked(range, datesArr) {
  return (
    range?.from &&
    range?.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ cabin, settings, bookedDates }) {
  const { range, setRange, resetRange } = useReservationContext();
  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;
  const { minBookingLength, maxBookingLength } = settings;
  const { regularPrice, discount } = cabin;
  const numberOfNights = differenceInDays(displayRange?.to, displayRange?.from);
  const cabinPrice = numberOfNights * (regularPrice - discount);
  const minDateAfter = addDays(range?.from, minBookingLength);
  const minDateBefore = subDays(range?.from, minBookingLength);

  return (
    <div className='flex flex-col justify-between'>
      <DayPicker
        className='place-self-center pt-12'
        mode='range'
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength}
        max={maxBookingLength}
        startMonth={new Date()}
        endMonth={new Date(new Date().getFullYear(), 5 * 12)}
        captionLayout='dropdown'
        numberOfMonths={2}
        hideNavigation={true}
        disabled={(currentDate) =>
          isPast(currentDate) ||
          bookedDates.some((date) => isSameDay(date, currentDate)) ||
          (isAfter(currentDate, displayRange?.from) &&
            isBefore(currentDate, minDateAfter)) ||
          (isBefore(currentDate, displayRange?.from) &&
            isAfter(currentDate, minDateBefore))
        }
      />

      <div className='flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]'>
        <div className='flex items-baseline gap-6'>
          <p className='flex gap-2 items-baseline'>
            {discount > 0 ? (
              <>
                <span className='text-2xl'>${regularPrice - discount}</span>
                <span className='line-through font-semibold text-primary-700'>
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className='text-2xl'>${regularPrice}</span>
            )}
            <span className=''>/night</span>
          </p>
          {numberOfNights ? (
            <>
              <p className='bg-accent-600 px-3 py-2 text-2xl'>
                <span>&times;</span> <span>{numberOfNights}</span>
              </p>
              <p>
                <span className='text-lg font-bold uppercase'>Total</span>{' '}
                <span className='text-2xl font-semibold'>${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className='border border-primary-800 py-2 px-4 text-sm font-semibold cursor-pointer'
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
