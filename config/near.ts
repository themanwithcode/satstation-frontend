export const getConfig = (env = 'testnet') => {
	switch (env) {
		case 'mainnet':
			return {
				networkId: 'mainnet',
				nodeUrl: 'https://rpc.mainnet.near.org',
				headers: null,
				walletUrl: 'https://wallet.mainnet.near.org',
				helperUrl: 'https://helper.mainnet.near.org',
				explorerUrl: 'https://explorer.near.org',
			}
		case 'development':
		case 'testnet':
			return {
				networkId: 'default',
				nodeUrl: 'https://rpc.testnet.near.org',
				headers: null,
				walletUrl: 'https://wallet.testnet.near.org',
				helperUrl: 'https://helper.testnet.near.org',
				explorerUrl: 'https://explorer.testnet.near.org',
			}
		case 'devnet':
			return {
				networkId: 'devnet',
				nodeUrl: 'https://rpc.devnet.near.org',
				walletUrl: 'https://wallet.devnet.near.org',
				helperUrl: 'https://helper.devnet.near.org',
				explorerUrl: 'https://explorer.devnet.near.org',
			}
		case 'betanet':
			return {
				networkId: 'betanet',
				nodeUrl: 'https://rpc.betanet.near.org',
				walletUrl: 'https://wallet.betanet.near.org',
				helperUrl: 'https://helper.betanet.near.org',
				explorerUrl: 'https://explorer.betanet.near.org',
			}
		case 'local':
			return {
				networkId: 'local',
				nodeUrl: 'http://localhost:3030',
				keyPath: `${process.env.HOME}/.near/validator_key.json`,
				walletUrl: 'http://localhost:4000/wallet',
			}
		case 'test':
		case 'ci':
			return {
				networkId: 'shared-test',
				nodeUrl: 'https://rpc.ci-testnet.near.org',
				masterAccount: 'test.near',
			}
		case 'ci-betanet':
			return {
				networkId: 'shared-test-staging',
				nodeUrl: 'https://rpc.ci-betanet.near.org',
				masterAccount: 'test.near',
			}
		default:
			throw Error(
				`Unconfigured environment '${env}'. Can be configured in src/config.js.`
			)
	}
}