import React, { JSXElementConstructor, ReactNode, useEffect, useState } from 'react'
import { combineLatest, map, Observable } from 'rxjs'
import { useDiInjectContainer } from '../DI-Inject-Context/di-inject-context'

export function withDiInject<T>(
    Component: JSXElementConstructor<T>,
    dependencyName: string,
    propsNames: string[]
) {
    return function DiInjectWrap(injectedProps: { children?: ReactNode }) {
        const container = useDiInjectContainer()
        const props = container.resolve(dependencyName)
        const requiredPropsNames = Object.keys(props).filter(item => propsNames.includes(item))
        const requiredProps = {}
        requiredPropsNames.forEach(propsName => {
            if (props[propsName]) {
                requiredProps[propsName] = props[propsName]
            }
        })

        const [viewProps, setViewProps] = useState(
            Object.keys(requiredProps).reduce((vp, key) => {
                const value = props[key]
                if (requiredPropsNames.includes(key)) {
                    return {
                        ...vp,
                        [key]: value
                    }
                }
                // return {
                //     ...vp,
                //     [key]: value
                // }
            }, {})
        )

        useEffect(() => {
            const outStreams: readonly Observable<[string, unknown]>[] = Object.keys(requiredProps).reduce(
                (vp, key) => {
                    const value = props[key]
                    const isObservableValue = value instanceof Observable

                    if (isObservableValue) {
                        return [...vp, value.pipe(map(nextStreamValue => [key, nextStreamValue]))]
                    }

                    return vp
                },
                [] as readonly Observable<[string, unknown]>[]
            )

            const outStream$ = combineLatest(outStreams).pipe(
                map(values => {
                        return values.reduce(
                            (vp, [key, value]) => ({
                                ...vp,
                                [key]: value
                            }),
                            {} as Partial<any>
                        );
                    }
                )
            )

            const subscription = outStream$.subscribe({
                next: partialProps => {
                    setViewProps({ ...viewProps, ...partialProps })
                }
            })

            return () => {
                subscription.unsubscribe()
            }
        }, [])

        if (!props) {
            throw new Error(`${dependencyName} is not exist in DI container`)
        }

        return <Component {...{ ...viewProps, ...injectedProps }} />
    }
}
