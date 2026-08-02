import { BrowserSession } from "./BrowserSession";

import {
  EvantraId,
} from "../account";

/**
 * Defines the persistence
 * contract for Browser Sessions.
 */
export interface BrowserSessionRepository {

  /**
   * Stores a Browser Session.
   */
  create(
    session: BrowserSession,
  ): Promise<void>;

  /**
   * Persists changes.
   */
  update(
    session: BrowserSession,
  ): Promise<void>;

  /**
   * Finds a Browser Session
   * by its internal identifier.
   */
  findById(
    id: string,
  ): Promise<BrowserSession | null>;

  /**
   * Finds a Browser Session
   * by its session identifier.
   */
  findBySessionId(
    sessionId: string,
  ): Promise<BrowserSession | null>;

  /**
   * Returns every active
   * Browser Session for an
   * Evantra Identity.
   */
  findByEvantraId(
    evantraId: EvantraId,
  ): Promise<BrowserSession[]>;

  /**
   * Returns every Browser Session
   * for an OAuth Client.
   */
  findByClientId(
    clientId: string,
  ): Promise<BrowserSession[]>;

  /**
   * Deletes a Browser Session.
   */
  delete(
    id: string,
  ): Promise<void>;

}