(() => {
    const onReadyHandler = () => {
        const { selectors, nearOptions, nearUtils, requestBody } = window;

        let $signInSignOutBtn, $getAccountBalanceInput, $getAccountDetailsInput, $callMethod;

        let isFetching = false;

        const toggleSignInSignOut = () => {
            if (nearIsAuthentificated) {
                $signInSignOutBtn.text(nearOptions.signOutText || 'SignOut');
            }
        }

        const showingBalance = async (id) => {
            const balance = await nearUtils.getNearBalance(id);
            window.nearData = window.nearData
                ? {
                    ...window.nearData,
                    balance,
                } : {
                    balance,
                }
            const balanceNodes = [
                $(nearUtils.createDataSelector('id', selectors.balance.total)),
                $(nearUtils.createDataSelector('id', selectors.balance.stateStaked)),
                $(nearUtils.createDataSelector('id', selectors.balance.staked)),
                $(nearUtils.createDataSelector('id', selectors.balance.available)),
            ]
            balanceNodes.forEach($node => {
                if ($node.length) {
                    $($node)
                        .empty()
                        .text(nearData?.balance[$node.data('id')])
                }
            });
        }

        const showingDetails = async (id) => {
            const details = await nearUtils.getNearAccountDetails(id);
            window.nearData = window.nearData
                ? {
                    ...window.nearData,
                    details,
                } : {
                    details,
                }
        }

        const signInSignOutPlugin = () => {
            $signInSignOutBtn = $(nearUtils.createDataSelector('id', selectors.signInSignOutBtn));
            if (!window.nearAPI) {
                connectNear($signInSignOutBtn.length && toggleSignInSignOut);
            }
            $signInSignOutBtn.on('click', signInSignOutHandlerHandler)
        }

        const walletConnectionPlugin = () => {
            if (!window.nearAPI) {
                connectNear();
            }
            $getAccountBalanceInput = $(nearUtils.createDataSelector('id', selectors.getAccountBalanceInput));
            $getAccountDetailsInput = $(nearUtils.createDataSelector('id', selectors.getAccountDetailsInput));

            if (nearIsAuthentificated) {
                if ($getAccountBalanceInput.length) {
                    $getAccountBalanceInput.on('keydown', onKeyDownHandler)
                }
                if ($getAccountDetailsInput.length) {
                    $getAccountDetailsInput.on('keydown', onKeyDownHandler)
                }
                showingBalance();
                showingDetails();
            }
        }

        const callMethodsPlugins = () => {
            if (!window.nearAPI) {
                connectNear();
            }
            $callMethod = $(nearUtils.createDataSelector('id', selectors.callMethod));
            if ($callMethod.length) {
                $callMethod.on('click', onCallMethodHandler)
            }
        }

        const signInSignOutHandlerHandler = async (event) => {
            const id = $(event.target).data('id');
            if (!isFetching) {
                isFetching = true;
                if (id === selectors.signInSignOutBtn) {
                    if (!nearIsAuthentificated) {
                        nearWallet.requestSignIn({
                            contractId: nearContract.contractId,
                            successUrl: nearOptions.successUrl || '/',
                        });
                    } else {
                        nearWallet.signOut();
                        window.location.replace(nearOptions.signOutUrl || '/');
                    }
                }
                isFetching = false;
            }
        }

        const onKeyDownHandler = event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const dataID = $(event.target).data('id');
                const value = event.target.value.trim();
                if (dataID === selectors.getAccountBalanceInput) {
                    showingBalance(value)
                } else if (dataID === selectors.getAccountDetailsInput) {
                    showingDetails(value)
                } else if (dataID === selectors.parseContractMethods) {
                    parseNearContract();
                }
            }
        }

        const onCallMethodHandler = async ({ target }) => {
            const data = $(target).data();
            const { id } = data;
            if (id === selectors.callMethod) {
                const { name } = data;
                try {
                    await nearContract[name](requestBody[name]);
                } catch (error) {
                    console.error('Near request error', error)
                }
            }
        }

        const initNear = () => {
            if (!window.nearAPI) {
                if (nearOptions?.plugins?.signInSignOut) {
                    signInSignOutPlugin();
                }
                if (nearOptions?.plugins?.walletConnection) {
                    walletConnectionPlugin();
                }
                if (nearOptions?.plugins?.callMethod) {
                    callMethodsPlugins();
                }
            }
        }
        initNear();
    }
    $(onReadyHandler)
})()