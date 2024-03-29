import type { Prisma } from '@prisma/client';

export enum PrismaError {
  UNIQUE_CONSTRAINT = 'Unique constraint failure',
  REQUIRED_RECORD_NOT_FOUND = 'Item could not be found',
  UNKNOWN = 'An unknown error occurred',
}

const errorCodesMap: Record<string, PrismaError> = {
  P2002: PrismaError.UNIQUE_CONSTRAINT,
  P2025: PrismaError.REQUIRED_RECORD_NOT_FOUND,
};

export const handlePrismaClientError = (error: Prisma.PrismaClientKnownRequestError): DatabaseError => {
  return new DatabaseError(errorCodesMap[error.code] ?? PrismaError.UNKNOWN, error);
};

export class DatabaseError extends Error {
  constructor(public message: PrismaError, private prismaError: Prisma.PrismaClientKnownRequestError) {
    super(message);

    console.debug(`Prisma Error '${prismaError.code}': ${prismaError.message}`);
  }

  public toJSON() {
    return {
      message: this.message,
    };
  }
}
