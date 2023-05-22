import { RecoilRoot } from 'recoil';
import '@fontsource/space-mono';
import { SeiWalletProvider } from '@sei-js/react';
import 'react-loading-skeleton/dist/skeleton.css';
import Fable from './Fable';

const App = () => {

	return (
		<RecoilRoot>
			<SeiWalletProvider
				chainConfiguration={{
					chainId: 'atlantic-2',
					restUrl: 'https://rest.atlantic-2.seinetwork.io/',
					rpcUrl: 'https://rpc.atlantic-2.seinetwork.io/'
				}}>
				<Fable/>
			</SeiWalletProvider>
		</RecoilRoot>
	);
};

export default App;
