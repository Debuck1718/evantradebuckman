"use client";

import {
  createContext,
  useContext,
  useEffect,
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

  async function refresh() {
    try {
      setLoading(true);

      const result =
        await validateSession();

      setAccount(
        result.account ?? null,
      );

      setSession(
        result.session ?? null,
      );
    } catch {
      setAccount(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setAccount(null);
    setSession(null);
  }

  useEffect(() => {
    refresh();
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