"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  validateSession,
  type AuthenticateResponse,
} from "../../app/lib/api";

interface IdentitySessionContextValue {
  account:
    | AuthenticateResponse["account"]
    | null;

  session:
    | AuthenticateResponse["session"]
    | null;

  loading: boolean;

  authenticated: boolean;

  refresh: () => Promise<void>;

  establish: (result: AuthenticateResponse) => void;

  clear: () => void;
}

const IdentitySessionContext =
  createContext<
    IdentitySessionContextValue | undefined
  >(undefined);

export function IdentitySessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [account, setAccount] =
    useState<
      AuthenticateResponse["account"] | null
    >(null);

  const [session, setSession] =
    useState<
      AuthenticateResponse["session"] | null
    >(null);

  const [loading, setLoading] =
    useState(true);

  const sessionRequestId = useRef(0);

  async function refresh() {
    const requestId = ++sessionRequestId.current;

    try {
      setLoading(true);

      const result =
        await validateSession();

      if (requestId !== sessionRequestId.current) {
        return;
      }

      /*
       * A null result means there is
       * no active browser session.
       * That is a normal, unauthenticated
       * state, not an error.
       */
      if (!result) {
        setAccount(null);
        setSession(null);
        return;
      }

      setAccount(
        result.account ?? null,
      );

      setSession(
        result.session ?? null,
      );
    } catch {
      if (requestId === sessionRequestId.current) {
        setAccount(null);
        setSession(null);
      }
    } finally {
      if (requestId === sessionRequestId.current) {
        setLoading(false);
      }
    }
  }

  function establish(result: AuthenticateResponse) {
    sessionRequestId.current += 1;
    setAccount(result.account);
    setSession(result.session);
    setLoading(false);
  }

  function clear() {
    sessionRequestId.current += 1;
    setAccount(null);
    setSession(null);
    setLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <IdentitySessionContext.Provider
      value={{
        account,
        session,
        loading,
        authenticated:
          account !== null &&
          session !== null,
        refresh,
        establish,
        clear,
      }}
    >
      {children}
    </IdentitySessionContext.Provider>
  );
}

export function useIdentitySession() {
  const context =
    useContext(
      IdentitySessionContext,
    );

  if (!context) {
    throw new Error(
      "useIdentitySession must be used inside IdentitySessionProvider.",
    );
  }

  return context;
}