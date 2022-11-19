import { AppError, AppErrorOptions } from '@codemucker/error'

/**
 * Thrown to indicate there was an error in the cqrs api
 */
export class MessageApiError extends AppError {
  constructor(opts: AppErrorOptions = {}, ctorFunc?: Function) {
    super(opts, ctorFunc || MessageApiError)
  }
}
