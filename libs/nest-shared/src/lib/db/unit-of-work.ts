/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';

import { MongooseSession } from './mongoose-session';
import { ClientSession } from 'mongoose';

/**
 * Handles database transactions.
 * It ensures consistency and rollback in case of errors during a transaction.
 * This class is injectable with a request scope.
 */
@Injectable()
export class UnitOfWork {
  private isAlive = true;

  public constructor(private readonly _session: MongooseSession) {}

  /**
   * Provides access to the current database session.
   * @returns The current session object.
   */
  public get session(): ClientSession {
    return this._session.session;
  }

  /**
   * Starts a new database session and transaction.
   * @returns A promise that resolves when the session and transaction start.
   */
  public async start(): Promise<void> {
    await this._session.startSession();
    this._session.startTransaction();
    this.isAlive = true;
  }

  /**
   * Commits the current transaction and ends the session.
   * If the transaction is already completed or an error occurs, it rolls back.
   * @returns A promise that resolves when the transaction is committed or rolled back.
   */
  public async commit(): Promise<void> {
    if (!this.isAlive) {
      return;
    }

    try {
      await this._session.commit();
    } catch (error) {
      await this._session.rollback();
      throw error;
    } finally {
      this.isAlive = false;
      await this._session.endSession();
    }
  }
}
