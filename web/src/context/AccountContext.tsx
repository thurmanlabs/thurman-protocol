import { createContext } from "react";

interface AccountContextInterface {
  account: string | undefined;
  accountBalance: string | undefined;
  onUpdateAccount: (account: string) => void;
  onUpdateBalance: (balance: string) => void;
}

export const AccountContext = createContext<AccountContextInterface>({
  account: undefined,
  accountBalance: undefined,
  onUpdateAccount: () => {},
  onUpdateBalance: () => {},
});
