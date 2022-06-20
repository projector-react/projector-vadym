import { IAuthService, LoginCredentials, UserInfo } from './types'
import { ApiPost, IApi } from '../apiService'

class AuthService implements IAuthService {
    post: ApiPost

    constructor(apiService: IApi) {
        this.post = apiService.post.bind(apiService)
    }

    login({ username, password }: LoginCredentials) {
        return this.post<string, void, LoginCredentials>('auth/login', {
            username,
            password
        }).then(res => res)
    }

    logout() {
        return this.post('auth/login', {}).then(res => res)
    }

    register({ username, password }: LoginCredentials) {
        return this.post<string, void, LoginCredentials>('auth/register', {
            username,
            password
        }).then(res => res)
    }

    getUser() {
        return this.post<UserInfo, void, Record<string, never>>('me', {}).then(res => res)
    }
}

export default AuthService
