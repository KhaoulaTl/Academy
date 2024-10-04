import { setting } from "@/config/setting";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const user = request.cookies.get("user")?.value;
    const roleUser = request.cookies.get("USER_ROLE")?.value;
    const urlPath = new URL(request.url).pathname;

    console.log('User:', user);
    console.log('Role User:', roleUser);
    console.log('URL Path:', urlPath);

    // Permet l'accès à toutes les pages publiques
    if (
        urlPath === setting.routes.Home ||
        //urlPath === setting.routes.AccessDenied ||
        urlPath === setting.routes.SignIn ||
        urlPath === setting.routes.SignUp 
    ) {
        console.log('Public page, allowing access');
        return NextResponse.next();
    }

    
    // Forcer la redirection pour les administrateurs vers leur route spécifique
    if (roleUser === setting.roles.admin && !urlPath.startsWith(setting.routes.Home)) {
      console.log('Admin user, forcing route to admin dashboard');
      return NextResponse.redirect(new URL(setting.routes.Home, request.url));
  }

    // Redirige les utilisateurs non authentifiés vers la page de login lors de l'accès à des pages protégées
    if (!user) {
        console.log('User not authenticated, redirecting to login');
        return NextResponse.redirect(new URL(setting.routes.SignIn, request.url));
    }

    
    // Redirige les utilisateurs authentifiés vers leur route spécifique basée sur leur rôle s'ils accèdent à des routes d'authentification
    if (user && urlPath.startsWith('/auth')) {
        console.log('Authenticated user accessing auth route');
        if (roleUser === setting.roles.admin) {
            console.log('Redirecting admin to their route');
            return NextResponse.redirect(new URL(setting.routes.Home, request.url));
        }
    }

}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
