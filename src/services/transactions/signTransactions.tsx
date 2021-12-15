import { validation } from '@elrondnetwork/dapp-utils';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import BigNumber from 'bignumber.js';

import { accountBalanceSelector } from 'redux/selectors';
import { setTransactionsToSign, setNotificationModal } from 'redux/slices';
import { store } from 'redux/store';
import { SignTransactionsPropsType } from './types';
import { calcTotalFee } from './utils';
import { networkConstants } from 'constants/index';

export function signTransactions({
  transactions,
  minGasLimit = networkConstants.DEFAULT_MIN_GAS_LIMIT
}: SignTransactionsPropsType) {
  const sessionId = Date.now().toString();
  const accountBalance = accountBalanceSelector(store.getState());
  const transactionsPayload = Array.isArray(transactions)
    ? transactions
    : [transactions];
  const bNtotalFee = calcTotalFee(transactionsPayload, minGasLimit);
  const bNbalance = new BigNumber(
    validation.stringIsFloat(accountBalance) ? accountBalance : '0'
  );
  const hasSufficientFunds = bNbalance.minus(bNtotalFee).isGreaterThan(0);

  if (!hasSufficientFunds) {
    const notificationPayload = {
      icon: faExclamationTriangle,
      iconClassName: 'text-warning',
      title: 'Insufficient EGLD funds',
      description: 'Current EGLD balance cannot cover the transaction fees.'
    };

    store.dispatch(setNotificationModal(notificationPayload));
    return;
  }

  const signTransactionsPayload = {
    sessionId,
    callbackRoute: window.location.pathname,
    transactions: transactionsPayload.map((tx) => tx.toPlainObject())
  };
  store.dispatch(setTransactionsToSign(signTransactionsPayload));
}

export default signTransactions;