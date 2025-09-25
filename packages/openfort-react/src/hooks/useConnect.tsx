/**
 * Custom wrapper around {@link wagmiUseConnect} that adds Openfort specific logic.
 *
 * This hook forwards configuration to Wagmi while applying Openfort defaults such as initial
 * chain selection and contextualised error logging.
 *
 * @param props - Optional configuration passed through to Wagmi's hook.
 * @returns Connection helpers augmented with Openfort defaults and logging.
 */

import {
  Connector,
  CreateConnectorFn,
  type UseConnectParameters,
  useConnect as wagmiUseConnect,
} from 'wagmi';
import { useOpenfort } from '../components/Openfort/useOpenfort';

export function useConnect({ ...props }: UseConnectParameters = {}) {
  const context = useOpenfort();

  const { connect, connectAsync, connectors, ...rest } = wagmiUseConnect({
    ...props,
    mutation: {
      ...props.mutation,
      onError(err) {
        if (err.message) {
          if (err.message !== 'User rejected request') {
            context.log(err.message, err);
          }
        } else {
          context.log(`Could not connect.`, err);
        }
      },
    },
  });

  return {
    connect: ({
      connector,
      chainId,
      mutation,
    }: {
      connector: CreateConnectorFn | Connector;
      chainId?: number;
      mutation?: UseConnectParameters['mutation'];
    }) => {
      return connect(
        {
          connector,
          chainId: chainId ?? context.uiConfig?.initialChainId,
        },
        mutation
      );
    },
    connectAsync: async ({
      connector,
      chainId,
      mutation,
    }: {
      connector: CreateConnectorFn | Connector;
      chainId?: number;
      mutation?: UseConnectParameters['mutation'];
    }) => {
      return connectAsync(
        {
          connector,
          chainId: chainId ?? context.uiConfig?.initialChainId,
        },
        mutation
      );
    },
    connectors,
    ...rest,
  };
}
