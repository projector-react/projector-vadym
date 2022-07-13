import { asClass, asFunction, createContainer, InjectionMode } from "awilix";
import { createAxiosInstance } from '../apiService/create-axios-instance'
import { AuthService } from '../Auth/auth-service'
import { AuthState } from '../Auth/auth-state'

const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
})

container.register(
    'apiService',
    asFunction(() => createAxiosInstance())
)

container.register('authService', asClass(AuthService))

container.register('authState', asClass(AuthState))

export { container }
