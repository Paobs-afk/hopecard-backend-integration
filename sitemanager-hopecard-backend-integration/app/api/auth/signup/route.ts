import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      barangay,
      municipality,
      province,
      validIdUrl,
    } = await request.json();

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, firstName, lastName' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    // Create auth client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the origin from the request
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Step 1: Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user?.id) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 400 }
      );
    }

    // Step 2: Create the donor profile using service role
    if (supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      const { error: profileError } = await supabaseAdmin
        .from('digital_donor_profiles')
        .insert({
          user_id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          barangay: barangay || null,
          municipality: municipality || null,
          province: province || null,
          valid_id_url: validIdUrl || null,
          status: 'Pending',
        });

      if (profileError) {
        // Log the error but don't fail - user was created
        console.error('Failed to create donor profile:', profileError);
        return NextResponse.json(
          {
            success: true,
            user: authData.user,
            warning: 'User created but profile creation had an issue',
          },
          { status: 200 }
        );
      }
    } else {
      // Fallback: try to create profile with anon key (requires RLS policies)
      const { error: profileError } = await supabase
        .from('digital_donor_profiles')
        .insert({
          user_id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          barangay: barangay || null,
          municipality: municipality || null,
          province: province || null,
          valid_id_url: validIdUrl || null,
          status: 'Pending',
        });

      if (profileError) {
        console.error('Failed to create donor profile:', profileError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        user: authData.user,
        message: 'Donor profile created successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
