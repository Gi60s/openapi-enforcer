
interface OpenApiEnforcer {
    (definition: object, defaultOptions?: OpenApiEnforcerOptions): OpenApiEnforcerInstance
}

interface OpenApiEnforcerInstance {
    deserialize(schema: object, value: any): any;
    errors(schema: object, value: any): string[]|void;
    serialize(scheam: object, value: any): any;
    path(path: string): { path: string, params: object };
    populate(schema: object, map: object, initialValue?: any): any;
    request(req: string|RequestObject): object;
    schema(path: string, schema?: object);
    validate(schema: string, value: any):void;
}

interface OpenApiEnforcerOptions {

}

interface RequestObject {
    cookies?: object;
    headers?: object;
    method?: string;
    path?: string
}