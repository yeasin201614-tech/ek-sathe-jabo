import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/services/dataService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, bookingReference, provider, transactionReference, amount, accountNumber } = body;

    if (!bookingReference || !amount || !transactionReference || !provider) {
      return NextResponse.json(
        { success: false, error: 'Missing mandatory payment verification fields.' },
        { status: 400 }
      );
    }

    // Call server-side verification in DataService
    const result = DataService.verifyAndConfirmPayment({
      bookingId: bookingId || '',
      bookingReference,
      provider,
      transactionReference,
      amount: Number(amount),
      accountNumber,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Booking confirmed and ticket issued.',
      booking: result.booking,
      payment: result.payment,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error in payment verification.' },
      { status: 500 }
    );
  }
}
