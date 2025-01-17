import { ProxyProvider } from '@elrondnetwork/erdjs';
import { Address } from '@elrondnetwork/erdjs/out';
import { networkConfigSelector } from 'redux/selectors';
import { store } from 'redux/store';
import { NetworkType } from 'types';

let proxyProvider: ProxyProvider | null = null;

export function initializeProxyProvider(networkConfig?: NetworkType) {
  const initializationNetworkConfig =
    networkConfig || networkConfigSelector(store.getState());
  proxyProvider = new ProxyProvider(initializationNetworkConfig.apiAddress, {
    timeout: Number(initializationNetworkConfig.apiTimeout)
  });
  return proxyProvider;
}

export function getProxyProvider(): ProxyProvider {
  if (proxyProvider == null) {
    return initializeProxyProvider();
  } else {
    return proxyProvider;
  }
}

export async function getAccountFromProxyProvider(address?: string) {
  try {
    const proxy = getProxyProvider();
    return await proxy.getAccount(new Address(address));
  } catch (err) {
    return null;
  }
}

export async function getNetworkConfigFromProxyProvider() {
  try {
    return await getProxyProvider().getNetworkConfig();
  } catch (err) {
    console.error('error fetching network config');
    return null;
  }
}
