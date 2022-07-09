import type { ExceptionFilter } from '@nestjs/common'
import { Catch } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any) {
    throw exception
  }
}
