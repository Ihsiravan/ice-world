import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const IMAGEKIT_PRIVATE_KEY = 'w8f2FKz9qf4iXXfX3Bg/7qta/cw=';

export async function GET(request: NextRequest) {
  try {
    // Generate a unique token (UUID v4 style)
    const token = crypto.randomBytes(16).toString('hex');
    
    // Set expiration time (30 minutes from now)
    const currentTime = Math.floor(Date.now() / 1000);
    const expire = currentTime + 1800; // 30 minutes = 1800 seconds
    
    console.log('Time debug:', { 
      currentTime, 
      expire, 
      currentTimeFormatted: new Date(currentTime * 1000).toISOString(),
      expireFormatted: new Date(expire * 1000).toISOString()
    });
    
    // Create signature using HMAC-SHA1
    // The signature should be calculated as: HMAC-SHA1(token + expire, privateKey)
    const dataToSign = token + expire.toString();
    console.log('Data being signed:', dataToSign);
    console.log('Private key (first 10 chars):', IMAGEKIT_PRIVATE_KEY.substring(0, 10) + '...');
    
    const signature = crypto
      .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
      .update(dataToSign)
      .digest('hex');
    
    console.log('Generated auth params:', { token, expire, signature });
    
    return NextResponse.json({
      token,
      expire,
      signature
    });
  } catch (error) {
    console.error('Error generating ImageKit auth:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication parameters' },
      { status: 500 }
    );
  }
} 