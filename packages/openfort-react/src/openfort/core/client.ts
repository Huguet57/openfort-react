import { Openfort as OpenfortClient, OpenfortSDKConfiguration } from '@openfort/openfort-js';


/**
 * Creates a new {@link OpenfortClient} instance.
 *
 * Use this helper to simplify SDK instantiation and keep configuration consistent across the
 * application.
 *
 * @param config - Configuration options passed directly to the Openfort SDK constructor.
 * @returns A configured Openfort client instance.
 *
 * @example
 * ```ts
 * const client = createOpenfortClient({
 *   baseConfiguration: { publishableKey: 'pk_test_123' },
 * });
 *
 * const token = await client.getAccessToken();
 * ```
 */
export function createOpenfortClient(config: OpenfortSDKConfiguration): OpenfortClient {
  return new OpenfortClient(config);
}

/**
 * Default Openfort client instance used internally by helper functions.
 *
 * Applications should create their own instances via {@link createOpenfortClient} unless they
 * specifically need to rely on the shared default client.
 */
let defaultClient: OpenfortClient | null = null;

/**
 * Gets or initialises the shared {@link OpenfortClient} instance.
 *
 * The first call can accept configuration to instantiate the client; subsequent calls reuse the
 * stored instance.
 *
 * @param options - Optional configuration used when initialising the client for the first time.
 * @returns The shared Openfort client instance.
 * @throws If the default client has not been set and no configuration options are provided.
 */
export function getDefaultClient(options?: OpenfortSDKConfiguration): OpenfortClient {
  if (!defaultClient && options) {
    defaultClient = new OpenfortClient(options);
  }

  if (!defaultClient) {
    throw new Error('Openfort client not initialized. Make sure to wrap your app with OpenfortProvider.');
  }

  return defaultClient;
}

/**
 * Sets the shared {@link OpenfortClient} instance.
 *
 * Use this when applications manage their own Openfort client and want to share it with the
 * internal helpers.
 *
 * @param client - Pre-configured Openfort client to store as the default.
 */
export function setDefaultClient(client: OpenfortClient): void {
  defaultClient = client;
}