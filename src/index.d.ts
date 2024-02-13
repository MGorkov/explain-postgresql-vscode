export type InternalID = string;

export interface IResult<T extends { [key: string]: any } = any> {
    /**
     * This id is unique for a single query result
     *
     * @type {InternalID}
     * @memberof IResult
     */
    resultId: InternalID;
    /**
     * This id represents a request to run one/multiple queries. It's used to group all queries in the same webview. Every request has it's own view
     *
     * @type {InternalID}
     * @memberof IResult
     */
    requestId: InternalID;
    label?: string;
    connId: string;
    error?: boolean;
    rawError?: Error;
    results: (T extends { [key: string]: any } ? T : any)[];
    cols: string[];
    query: string;
    baseQuery?: string; // used for extension generated queries
    messages: (string | { message: string; date: Date })[];
    page?: number;
    total?: number;
    pageSize?: number;
    queryType?: 'showRecords' | 'describeTable';
    queryParams?: { [k: string]: any };
}

export interface IExplainSettings {
    ANALYZE: boolean;
    VERBOSE: boolean;
    COSTS: boolean;
    SETTINGS: boolean;
    GENERIC_PLAN: boolean;
    BUFFERS: boolean;
    WAL: boolean;
    TIMING: boolean;
    SUMMARY: boolean;
}

export type BeatifierResponse = {
    btf_query: string;
    btf_query_text: string;
}