import { ExtensionContext } from "vscode";

let extensionContext: ExtensionContext & {set: typeof setContext} = {} as any;

const setContext = (ctx: ExtensionContext) => {
    extensionContext = ctx as typeof extensionContext;
}

let handler = {
    get(target: typeof extensionContext, prop: string) {
        if (prop === 'set') return setContext;
        return extensionContext[prop as keyof typeof extensionContext];
    }
}

const Context = new Proxy<typeof extensionContext>(extensionContext, handler);

export default Context;