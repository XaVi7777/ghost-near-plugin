window.nearUtils = {
    createDataSelector: (selector, value) => `[data-${selector}="${value}"]`,
    getNearBalance: async (id) => {
        const accountID = id || nearWallet.getAccountId();
        const account = await nearAPI.account(accountID);
        const balance = await account.getAccountBalance();
        return balance;
    },
    getNearAccountDetails: async (id) => {
        const accountID = id || nearWallet.getAccountId();
        const account = await nearAPI.account(accountID);
        const details = await account.getAccountDetails();
        return details;
    },
    nearBalanceToFixed: (value, toFixed) => +(value / 1e24).toFixed(toFixed)
}