import { scan, Subject, switchMap, map, merge, Observable } from 'rxjs'
import { IAuthService } from './auth-service'

export type LoginCredentials = {
    readonly username: string
    readonly password: string
}

export interface IAuthState {
    readonly login: (loginCredentials: LoginCredentials) => void
    readonly logout: () => void
    readonly register: (loginCredentials: LoginCredentials) => void
    readonly refreshToken: () => void
}

type State = {
    isAuthenticated: boolean
}

const initialAuthState: State = {
    isAuthenticated: false
}

enum AuthEvents {
    DidLoginRequestCompleted,
    DidRegisterRequestCompleted,
    DidLogoutRequestCompleted,
    DidTokenRefreshRequestCompleted
}

const authActions = {
    DidRegisterRequestCompleted: (creds: LoginCredentials) =>
        ({
        type: AuthEvents.DidRegisterRequestCompleted,
        payload: { creds }
    } as const),
    DidLoginRequestCompleted: (creds: LoginCredentials) =>
        ({
        type: AuthEvents.DidLoginRequestCompleted,
        payload: { creds }
    } as const),
    DidLogoutRequestCompleted: () =>
        ({
        type: AuthEvents.DidLogoutRequestCompleted
    } as const),
    DidTokenRefreshRequestCompleted: () =>
        ({
        type: AuthEvents.DidTokenRefreshRequestCompleted
    } as const)
}

export class AuthState implements IAuthState {
    loginPostRequest: (creds: LoginCredentials) => void

    logoutPostRequest: () => void

    registerPostRequest: (creds: LoginCredentials) => void

    refreshTokenPostRequest: () => void

    onRegister$: Subject<LoginCredentials>

    onLogin$: Subject<LoginCredentials>

    onLogout$: Subject<void>

    onRefreshToken$: Subject<void>

    state$: Observable<unknown>

    constructor(authService: IAuthService) {
        this.loginPostRequest = authService.login.bind(authService)
        this.logoutPostRequest = authService.logout.bind(authService)
        this.registerPostRequest = authService.register.bind(authService)
        this.refreshTokenPostRequest = authService.refreshToken.bind(authService)
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.refreshToken = this.refreshToken.bind(this)
        this.logout = this.logout.bind(this)
        this.loginResult$ = this.loginResult$.bind(this)
        this.registerResult$ = this.registerResult$.bind(this)
        this.refreshResult$ = this.refreshResult$.bind(this)
        this.logoutResult$ = this.logoutResult$.bind(this)
        this.onRegister$ = new Subject<LoginCredentials>()
        this.onLogin$ = new Subject<LoginCredentials>()
        this.onLogout$ = new Subject<void>()
        this.onRefreshToken$ = new Subject<void>()

        this.state$ = merge(
            this.loginResult$().pipe(map(authActions.DidLoginRequestCompleted)),
            this.registerResult$().pipe(map(authActions.DidRegisterRequestCompleted)),
            this.logoutResult$().pipe(map(authActions.DidLogoutRequestCompleted)),
            this.refreshResult$().pipe(map(authActions.DidTokenRefreshRequestCompleted))
        ).pipe(
            scan((state, event) => {
                switch (event.type) {
                    case AuthEvents.DidLoginRequestCompleted:
                        return {
                            ...state,
                            isAuthenticated: true
                        }
                    case AuthEvents.DidRegisterRequestCompleted:
                        return {
                            ...state,
                            isAuthenticated: true
                        }
                    case AuthEvents.DidTokenRefreshRequestCompleted:
                        return {
                            ...state,
                            isAuthenticated: true
                        }
                    case AuthEvents.DidLogoutRequestCompleted:
                        return {
                            ...state,
                        isAuthenticated: false
                        }
                    default:
                        return state
                }
            }, initialAuthState)
        )
    }

    registerResult$() {
        return this.onRegister$.pipe(
            switchMap(async (creds: LoginCredentials) => this.registerPostRequest(creds) as any)
        )
    }

    loginResult$() {
        return this.onLogin$.pipe(
            switchMap(async (creds: LoginCredentials) => this.loginPostRequest(creds) as any)
        )
    }

    logoutResult$() {
        return this.onLogout$.pipe(switchMap(async () => this.logoutPostRequest()))
    }

    refreshResult$() {
        return this.onRefreshToken$.pipe(switchMap(async () => this.refreshTokenPostRequest))
    }

    login(loginCredentials: LoginCredentials) {
        return this.onLogin$.next(loginCredentials)
    }

    logout() {
        return this.onLogout$.next()
    }

    register(creds: LoginCredentials) {
        return this.onRegister$.next(creds)
    }

    refreshToken() {
        return this.onRefreshToken$.next()
    }
}
