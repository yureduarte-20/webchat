export class Container {
    // holding instances of injectable classes by key
    private static registry: Map<string, any> = new Map();

    static register(key: string, instance: any) {
        //console.log(key, instance)
        if (!Container.registry.has(key)) {
            Container.registry.set(key, instance);
            console.log(`Added ${key} to the registry.`);
        } else {
            throw new Error('Already registred')
        }
    }

    static get<T>(key: string) {
        if(!Container.registry.has(key)) throw new Error(`Dependency with key ${key} not injected`)
        return Container.registry.get(key) as T
    }
    static getRegistredDepenciesName(){
        return Array.from(Container.registry.keys())
    }
}


export interface Injection {
    index: number;
    key: string;
}
export function injectionTarget() {
    return function injectionTarget<T extends { new(...args: any[]): {} }>(constructor: T): T | void {
        return class extends constructor {
            constructor(...args: any[]) {
                console.log(constructor)
                const injections = (constructor as any).injections as Injection[]

                const injectedArgs: any[] = injections.sort(({ index }, { index:n_index}) => index - n_index ).map(({ key }) => {
                    console.log(`Injecting an instance identified by key ${key}`)
                    return Container.get(key)
                })

                super(...injectedArgs);
            }
        }
    }
}


export function inject(key: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        const injection: Injection = { index: parameterIndex, key }
        const existingInjections: Injection[] = (target as any).injections || []

        Object.defineProperty(target, "injections", {

            configurable: true,
            writable: true,
            value: [...existingInjections, injection]
        })
    }
}