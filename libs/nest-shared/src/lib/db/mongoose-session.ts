import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession } from 'mongoose';

@Injectable()
export class MongooseSession {
  public constructor(
    @InjectConnection() private readonly connection: mongoose.Connection
  ) {}
  public session: ClientSession;

  public async startSession(): Promise<ClientSession> {
    this.session = await this.connection.startSession();
    return this.session;
  }

  public startTransaction(): void {
    this.session.startTransaction();
  }

  public async commit(): Promise<void> {
    await this.session.commitTransaction();
  }

  public async rollback(): Promise<void> {
    await this.session.abortTransaction();
  }

  public async endSession(): Promise<void> {
    await this.session.endSession({ force: true, forceClear: true });
  }
}
