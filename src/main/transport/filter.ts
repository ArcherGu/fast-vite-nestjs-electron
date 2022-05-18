import { Catch, ExceptionFilter } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any) {
    throw exception
  }
}
