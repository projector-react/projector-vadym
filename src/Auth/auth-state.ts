import { scan, Subject, switchMap, map, merge, Observable, ReplaySubject } from "rxjs";
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
    readonly isAuthenticated$: () => Observable<boolean>
}

type State = {
    isAuthenticated: boolean
}

type Tokens = {
    access_token: string
    refresh_token: string
}

const initialAuthState: State = {
    isAuthenticated: false
}

enum AuthEvent {
    DidLoginRequestCompleted = 'DidLoginRequestCompleted',
    DidRegisterRequestCompleted = 'DidRegisterRequestCompleted',
    DidLogoutRequestCompleted = 'DidLogoutRequestCompleted',
    DidTokenRefreshRequestCompleted = 'DidTokenRefreshRequestCompleted'
}

const authActions = {
    DidRegisterRequestCompleted: (tokens: Tokens) =>
        ({
        type: AuthEvent.DidRegisterRequestCompleted,
        payload: { tokens }
    } as const),
    DidLoginRequestCompleted: (tokens: Tokens) =>
        ({
        type: AuthEvent.DidLoginRequestCompleted,
        payload: { tokens }
    } as const),
    DidLogoutRequestCompleted: () =>
        ({
        type: AuthEvent.DidLogoutRequestCompleted
    } as const),
    DidTokenRefreshRequestCompleted: (tokens: Tokens) =>
        ({
        type: AuthEvent.DidTokenRefreshRequestCompleted,
        payload: { tokens }
    } as const)
}

export class AuthState implements IAuthState {
    onRegister$: Subject<LoginCredentials>

    onLogin$: Subject<LoginCredentials>

    onLogout$: Subject<void>

    onRefreshToken$: Subject<void>

    state$: Observable<State>

    authService: IAuthService

    constructor(authService: IAuthService) {
        this.authService = authService
        this.isAuthenticated$ = this.isAuthenticated$.bind(this)
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.refreshToken = this.refreshToken.bind(this)
        this.logout = this.logout.bind(this)
        this.onRegister$ = new Subject<LoginCredentials>()
        this.onLogin$ = new Subject<LoginCredentials>()
        this.onLogout$ = new Subject<void>()
        this.onRefreshToken$ = new ReplaySubject<void>(1)

        this.state$ = merge(
            this.loginResult$().pipe(map(authActions.DidLoginRequestCompleted)),
            this.registerResult$().pipe(map(authActions.DidRegisterRequestCompleted)),
            this.logoutResult$().pipe(map(authActions.DidLogoutRequestCompleted)),
            this.refreshResult$().pipe(map(authActions.DidTokenRefreshRequestCompleted))
        ).pipe(
            scan((state, event) => {
                switch (event.type) {
                    case AuthEvent.DidLoginRequestCompleted: {
                        return {
                            ...state,
                            isAuthenticated: true
                        }
                    }
                    case AuthEvent.DidRegisterRequestCompleted: {
                        return {
                            ...state,
                            isAuthenticated: true
                        }
                    }
                    case AuthEvent.DidTokenRefreshRequestCompleted: {
                        const { tokens } = event.payload
                        return {
                            ...state,
                            isAuthenticated: !!tokens?.access_token
                        }
                    }
                    case AuthEvent.DidLogoutRequestCompleted: {
                        return {
                            ...state,
                            isAuthenticated: false
                        }
                    }
                    default: {
                        return state
                    }
                }
            }, initialAuthState)
        )
    }

    private registerResult$() {
        return this.onRegister$.pipe(
            switchMap(async (creds: LoginCredentials) => this.authService.register(creds))
        )
    }

    private loginResult$() {
        return this.onLogin$.pipe(
            switchMap(async (creds: LoginCredentials) => this.authService.login(creds))
        )
    }

    private logoutResult$() {
        return this.onLogout$.pipe(switchMap(async () => this.authService.logout()))
    }

    private refreshResult$() {
        return this.onRefreshToken$.pipe(switchMap(async () => this.authService.refreshToken()))
    }

    public login(loginCredentials: LoginCredentials) {
        return this.onLogin$.next(loginCredentials)
    }

    public logout() {
        return this.onLogout$.next()
    }

    public register(creds: LoginCredentials) {
        return this.onRegister$.next(creds)
    }

    public refreshToken() {
        return this.onRefreshToken$.next()
    }

    public isAuthenticated$() {
        return this.state$.pipe(map(({ isAuthenticated }) => isAuthenticated))
    }
}
