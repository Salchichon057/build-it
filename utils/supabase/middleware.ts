import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Protected routes - redirect to sign-in if not authenticated
    if (request.nextUrl.pathname.startsWith("/dashboard") && userError) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If user is authenticated and tries to access the home page
    if (request.nextUrl.pathname === "/" && !userError && user) {
      try {
        // Get user profile to determine account type
        const { data: profile } = await supabase
          .from("users")
          .select("account_type, first_name, last_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          // Check if profile is complete
          const isProfileComplete = profile.first_name && profile.last_name;
          
          if (!isProfileComplete) {
            return NextResponse.redirect(new URL("/dashboard/complete-profile", request.url));
          }
          
          // Redirect based on account type
          if (profile.account_type === "client") {
            return NextResponse.redirect(new URL("/dashboard/projects", request.url));
          } else if (profile.account_type === "professional") {
            return NextResponse.redirect(new URL("/dashboard/projects/available", request.url));
          } else {
            // Default fallback
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        } else {
          // Profile not found, redirect to complete profile
          return NextResponse.redirect(new URL("/dashboard/complete-profile", request.url));
        }
      } catch (error) {
        console.error("Error fetching user profile in middleware:", error);
        // Fallback to complete profile
        return NextResponse.redirect(new URL("/dashboard/complete-profile", request.url));
      }
    }

    // Redirect authenticated users away from auth pages
    if (!userError && user) {
      const authPages = ["/sign-in", "/sign-up", "/forgot-password"];
      if (authPages.includes(request.nextUrl.pathname)) {
        try {
          // Get user profile to determine where to redirect
          const { data: profile } = await supabase
            .from("users")
            .select("account_type, first_name, last_name")
            .eq("id", user.id)
            .single();

          if (profile) {
            const isProfileComplete = profile.first_name && profile.last_name;
            
            if (!isProfileComplete) {
              return NextResponse.redirect(new URL("/dashboard/complete-profile", request.url));
            }
            
            // Redirect based on account type
            if (profile.account_type === "client") {
              return NextResponse.redirect(new URL("/dashboard/projects", request.url));
            } else if (profile.account_type === "professional") {
              return NextResponse.redirect(new URL("/dashboard/projects/available", request.url));
            } else {
              return NextResponse.redirect(new URL("/dashboard", request.url));
            }
          } else {
            return NextResponse.redirect(new URL("/dashboard/complete-profile", request.url));
          }
        } catch (error) {
          console.error("Error fetching user profile for auth redirect:", error);
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }

    return response;
  } catch (e) {
    console.error("Middleware error:", e);
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
