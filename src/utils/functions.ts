import 'dotenv/config'

const isConstructorProxyHandler = {
    construct() {
        return Object.prototype
    }
}

export function isConstructor(func: any, _class: any) {
    try {
        new new Proxy(func, isConstructorProxyHandler)()
        if (!_class) return true
        return func.prototype instanceof _class
    } catch (err) {
        return false
    }
}
export function isUserDeveloper(userId: string) {
    return (JSON.parse(process.env.DEVELOPERS as string) as string[]).includes(userId)
}
