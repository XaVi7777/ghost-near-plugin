(() => {
    if (window) {
        window.connectNear = (succsessCallback) => {
            try {
                // connect to NEAR
                window.nearAPI = new nearApi.Near({
                    keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
                    ...getNearConfig(window.nearOptions.networkID)
                });
                // connect to the NEAR Wallet
                window.nearWallet = new nearApi.WalletConnection(nearAPI, nearOptions.appName);
                // connect to a NEAR smart contract
                window.nearContract = new nearApi.Contract(
                    nearWallet.account(),
                    window.nearOptions.contract.id, {
                    viewMethods: window.nearOptions.contract.viewMethods,
                    changeMethods: window.nearOptions.contract.changeMethods,
                });

                window.nearIsAuthentificated = nearWallet.isSignedIn();

                if (typeof succsessCallback === 'function') {
                    succsessCallback();
                }
            } catch (error) {
                console.error('Error with connect to near', error)
            }
        }
    }
})()