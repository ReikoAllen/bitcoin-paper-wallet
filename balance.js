const axios = require('axios');

async function getBalance(address) {
    try {
        const url = `https://blockstream.info/api/address/${address}`;
        const response = await axios.get(url);
        const data = response.data;
        const confirmed = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
        const unconfirmed = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
        const total = confirmed + unconfirmed;
        return {
            confirmed: (confirmed / 1e8).toFixed(9),
            unconfirmed: (unconfirmed / 1e8).toFixed(9),
            total: (total / 1e8).toFixed(9)
        };
    } catch (err) {
        console.error('Balance fetch error:', err.message || err);
        throw new Error('Failed to fetch balance');
    }
}

module.exports = { getBalance };