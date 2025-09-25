/**
 * Helpers for constructing default Wagmi transports for supported chains.
 *
 * These utilities favour convenience over granular control. They are well suited
 * for straightforward integrations where automatically configuring transports is
 * preferable to repeating boilerplate in every application.
 */

import { fallback, http, webSocket } from 'wagmi';
import { type CreateConfigParameters } from '@wagmi/core';
import { type Chain, mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { type HttpTransport, type WebSocketTransport } from 'viem';

import { chainConfigs } from './constants/chainConfigs';

/**
 * Builds a transport based on the configured provider and chain.
 *
 * @internal
 */
const createTransport = ({
  chain,
  provider = 'public',
  apiKey,
}: {
  chain: Chain;
  provider: 'alchemy' | 'infura' | 'public';
  apiKey: string;
}): HttpTransport | WebSocketTransport => {
  const supportedChain = chainConfigs.find((c) => c.id === chain.id);
  if (supportedChain?.rpcUrls) {
    if (provider === 'alchemy') {
      if (supportedChain.rpcUrls?.alchemy?.http) {
        return http(supportedChain.rpcUrls?.alchemy?.http + apiKey);
      } else {
        return webSocket(supportedChain.rpcUrls?.alchemy?.webSocket + apiKey);
      }
    } else if (provider === 'infura') {
      if (supportedChain.rpcUrls?.infura?.http) {
        return http(supportedChain.rpcUrls?.infura?.http + apiKey);
      } else {
        return webSocket(supportedChain.rpcUrls?.infura?.webSocket + apiKey);
      }
    }
  }
  return http();
};

/**
 * Options for {@link getDefaultTransports}.
 */
type GetDefaultTransportsProps = {
  chains?: CreateConfigParameters['chains'];
  alchemyId?: string;
  infuraId?: string;
};

/**
 * Creates a map of Wagmi transports for the provided chains.
 *
 * Each chain receives a fallback transport that prioritises API-key-authenticated providers before
 * falling back to the public transport.
 *
 * @param props - Configuration for the generated transports.
 * @param props.chains - Chains that require transports. Defaults to popular EVM chains.
 * @param props.alchemyId - Alchemy API key used to prioritise Alchemy transports when available.
 * @param props.infuraId - Infura API key used to prioritise Infura transports when available.
 * @returns A record mapping chain identifiers to their fallback transport configuration.
 */
export const getDefaultTransports = ({
  chains = [mainnet, polygon, optimism, arbitrum],
  alchemyId,
  infuraId,
}: GetDefaultTransportsProps): CreateConfigParameters['transports'] => {
  const transports: CreateConfigParameters['transports'] = {};
  Object.keys(chains).forEach((key, index) => {
    const chain = chains[index];
    const urls: (HttpTransport | WebSocketTransport)[] = [];
    if (alchemyId)
      urls.push(
        createTransport({ chain, provider: 'alchemy', apiKey: alchemyId })
      );
    if (infuraId)
      urls.push(
        createTransport({ chain, provider: 'infura', apiKey: infuraId })
      );

    urls.push(http());

    transports[chain.id] = fallback(urls);
  });

  return transports;
};
