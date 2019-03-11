import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
/**
 * Class Auth Guard
 */
export class AuthGuard implements CanActivate {
    /**
     * Auth Guard constructor.
     * @param {AuthService} auth
     */
    public constructor(private auth: AuthService) {
    }

    /**
     * Can activate method.
     * @param {ActivatedRouteSnapshot} route The route
     * @param {RouterStateSnapshot} state The state of the router
     * @returns {boolean} Whether the user can navigate to this route or not
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.auth.isAuthenticated();
    }
}
