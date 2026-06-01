import { NextRequest, NextResponse } from 'next/server';

// Locale detection/redirect is handled by .htaccess on cPanel.
// This middleware is a no-op passthrough; it is not executed in static export.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
