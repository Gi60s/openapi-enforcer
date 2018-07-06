export as namespace OpenApiEnforcer;

export = OpenApiEnforcer;

declare function OpenApiEnforcer(definition: object, options?: OpenApiEnforcer.EnforcerOptions): OpenApiEnforcer.Instance;
declare function OpenApiEnforcer(version: string, options?: OpenApiEnforcer.EnforcerOptions): OpenApiEnforcer.Instance;

declare namespace OpenApiEnforcer {

    export interface DeserializeOptions {
        throw?: boolean;
    }

    export interface EnforcerOptions {
        deserialize?: DeserializeOptions;
        errors: ErrorsOptions;
        populate?: PopulateOptions;
        request?: RequestOptions;
        serialize?: SerializeOptions;
    }

    export interface ErrorsOptions {
        prefix?: string;
    }

    export interface PopulateOptions {
        copy?: boolean;
        defaults?: boolean;
        ignoreMissingRequired?: boolean;
        replacement?: string;
        templateDefaults?: boolean;
        templates?: boolean;
        throw?: boolean;
        variables?: boolean;
    }

    export interface RequestOptions {
        throw?: boolean;
    }

    export interface RequestObject {
        body?: string|object;
        cookies?: object;
        headers?: object;
        method?: string;
        path?: string;
    }

    export interface ResponseObject {
        code: string;
        contentType: string;
        path: string;
        method?: string;
    }

    export interface SerializeOptions {
        throw?: boolean;
    }

    export interface Instance {
        deserialize(schema: object, value: any): any;
        errors(schema: object, value: any): string[]|void;
        path(path: string): { path: string, params: object };
        random(schema: object, options?: object):any;
        populate(schema: object, params?: object, params?: object, options?: PopulateOptions): any;
        request(req: string|RequestObject): object;
        response(req: string|ResponseObject)
        schema(path: string, schema?: object);
        serialize(schema: object, value: any): any;
        validate(schema: string, value: any):void;
        version():string;
    }

}