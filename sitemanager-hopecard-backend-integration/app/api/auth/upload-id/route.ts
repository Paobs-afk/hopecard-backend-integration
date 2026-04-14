import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and PDF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must not exceed 5MB' },
        { status: 400 }
      );
    }

    // Use service role if available, otherwise use anon key
    const key = supabaseServiceKey || supabaseAnonKey;
    const supabase = createClient(supabaseUrl, key!);

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${userId}/${timestamp}-valid-id.${ext}`;

    // Upload file to storage bucket
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('donor-ids')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json(
        { error: `Failed to upload file: ${error.message}` },
        { status: 400 }
      );
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('donor-ids').getPublicUrl(filename);

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: data.path,
        message: 'ID uploaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    console.error('Upload error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
