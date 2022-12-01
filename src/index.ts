export * from './error'

export interface Message<_TResponse = void> {
  readonly messageName: string

  /**
   * Id of this message
   */
  readonly messageId?: string

  /**
   * If of the request sending the message. Multiple messages could be sent per request
   */
  readonly requestId?: string

  /**
   * And id to correlate a number of seemingly disparate messages
   */
  readonly correlationId?: string

  /**
   * Some message source originator local tracking id
   */
  readonly sourceId?: string
}

export interface Event<TPayload> extends Message<void> {
  payload: TPayload
}

export interface Command<TPayload> extends Message<CommandResponse> {
  payload: TPayload
}

export class Command<TPayload> implements Command<TPayload> {
  constructor(public readonly messageName: string, public payload: TPayload) {}

  async invoke(api: MessageApi): Promise<CommandResponse> {
    return api.command<TPayload>(this)
  }
}

export interface CommandResponse {
  readonly correlationId?: string
  /**
   * The id of the initiating request
   */
  readonly requestId?: string
  /**
   * The id of the source message intiating this response
   */
  readonly messageId?: string
  /**
   * The id of the response. Can be used to poll/query on the outcome of this command
   */
  readonly responseId?: string
}

export class CommandResponse implements CommandResponse {
  constructor(public readonly commandId?: string) {}
}
export interface GetQueryOptions {
  failIfNotFound?: boolean
}

export interface GetQuery<TCriteria, TResult>
  extends Message<FindQueryResponse<TResult>> {
  readonly criteria: TCriteria
  readonly options: GetQueryOptions
}

export abstract class GetQuery<TCriteria, TResult>
  implements GetQuery<TCriteria, TResult>
{
  constructor(
    public readonly messageName: string,
    public readonly criteria: TCriteria,
    public readonly options: GetQueryOptions = {}
  ) {}

  async invoke(api: MessageApi): Promise<GetQueryResponse<TResult>> {
    return api.get<TCriteria, TResult>(this)
  }
}

export interface GetQueryResponse<TResult> {
  readonly result: TResult
}

export class GetQueryResponse<TResult> implements GetQueryResponse<TResult> {
  constructor(public readonly result: TResult) {}
}

export interface FindQueryOptions {
  limit?: number
}

export interface FindQuery<TCriteria, TResult>
  extends Message<FindQueryResponse<TResult>> {
  readonly criteria: TCriteria
  readonly options: FindQueryOptions
}

export abstract class FindQuery<TCriteria, TResult>
  implements FindQuery<TCriteria, TResult>
{
  limit = 100

  constructor(
    public readonly messageName: string,
    public readonly criteria: TCriteria,
    public readonly options: FindQueryOptions = {}
  ) {}

  async invoke(api: MessageApi): Promise<FindQueryResponse<TResult>> {
    return api.find<TCriteria, TResult>(this)
  }
}

export interface FindQueryResponse<TResult> {
  readonly results: Array<TResult>
  readonly offset: number
  readonly hasMore: boolean
}

export class FindQueryResponse<TResult> implements FindQueryResponse<TResult> {
  constructor(
    public readonly results: Array<TResult>,
    public readonly offset = 0,
    public readonly hasMore = false
  ) {}
}

export interface MessageApi {
  /**
   * Send a typed get message and get a typed response back
   * @param query
   */
  get<TCriteria, TResult>(
    query: GetQuery<TCriteria, TResult>
  ): Promise<GetQueryResponse<TResult>>

  /**
   * Send a typed find message and get a typed response back
   * @param find
   */
  find<TCriteria, TResult>(
    find: FindQuery<TCriteria, TResult>
  ): Promise<FindQueryResponse<TResult>>

  /**
   * Send a typed command message and get a typed response back
   * @param command
   */
  command<TPayload>(command: Command<TPayload>): Promise<CommandResponse>

  /**
   * generic message. Returns a command, query, or get response
   * @param message
   */
  invoke<TMessage extends Message<TResponse>, TResponse = void>(
    message: TMessage
  ): Promise<TResponse>
}
