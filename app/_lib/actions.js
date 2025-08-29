'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth, signIn, signOut } from './auth';
import { getBooking, getBookings } from './data-service';
import { supabase } from './supabase';

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in to update guest data');

  const nationalId = formData.get('nationalId');
  const [nationality, countryFlag] = formData.get('nationality').split('%');
  if (!/^[а-яА-Яa-zA-Z0-9]{6,12}$/.test(nationalId))
    throw new Error('Please provide a valid national ID');

  const updatedData = {
    nationality,
    countryFlag,
    nationalId,
  };
  const { error } = await supabase
    .from('guests')
    .update(updatedData)
    .eq('id', session.user.guestId);

  if (error) throw new Error('Guest could not be updated');
  revalidatePath('/account/profile');
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in to delete bookings');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You are not allowed to delete this bookings');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);
  if (error) throw new Error('Booking could not be deleted');
  revalidatePath('/account/reservations');
}

export async function updateBooking(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in to edit bookings');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  const bookingId = Number(formData.get('bookingId'));
  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You are not allowed to edit this booking');

  const updatedData = {
    numberOfGuests: Number(formData.get('numberOfGuests')),
    observations: formData.get('observations').slice(0, 1000),
  };

  const { error } = await supabase
    .from('bookings')
    .update(updatedData)
    .eq('id', bookingId);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  redirect('/account/reservations');
}
