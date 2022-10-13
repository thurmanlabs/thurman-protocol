import { createContext } from "react";

interface AccountContextInterface {
  account: string | undefined;
  accountBalance: string | undefined;
  chainId: string | undefined;
  onUpdateAccount: (account: string) => void;
  onUpdateBalance: (balance: string) => void;
  onUpdateChainId: (chainId: string) => void;
}

export const AccountContext = createContext<AccountContextInterface>({
  account: undefined,
  accountBalance: undefined,
  chainId: undefined,
  onUpdateAccount: () => {},
  onUpdateBalance: () => {},
  onUpdateChainId: () => {},
});
