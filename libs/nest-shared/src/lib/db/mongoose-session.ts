import { Injectable } from '@nestjs/common';
import mongoose, { ClientSession } from 'mongoose';

@Injectable()
export class MongooseSession {
  public session: ClientSession;

  public async startSession(): Promise<ClientSession> {
    this.session = await mongoose.startSession();
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
    await this.session.endSession();
  }
}
