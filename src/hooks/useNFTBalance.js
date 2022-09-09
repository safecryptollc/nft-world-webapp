import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

const blanceData = '[{ "token_address": "0x412af954e521f17fa13cd8f2983a1e612db6bb2b", "token_id": "9", "amount": "1", "token_hash": "ffab481f2e39f06cd4ee35d0db381d3d", "block_number_minted": "17471564", "updated_at": null, "contract_type": "ERC721", "name": "Iconic Apes", "symbol": "IAPES", "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmR73rRPpg8CEhH5wTGewVAQQNEEF4mGqVdx1ovaFAW7uA/9", "metadata": { "name": "Iconic Apes #9", "description": "31 Unique Iconic Apes", "image": "ipfs://QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/09.png", "attributes": [{ "trait_type": "Background", "value": "(66)" }] }, "last_token_uri_sync": "2022-07-18T03:46:36.043Z", "last_metadata_sync": "2022-07-18T03:50:34.754Z", "image": "https://gateway.ipfs.io/ipfs/QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/09.png" }, { "token_address": "0x412af954e521f17fa13cd8f2983a1e612db6bb2b", "token_id": "2", "amount": "1", "token_hash": "ff472911c666b1e1ad7e240581669d28", "block_number_minted": "17471564", "updated_at": null, "contract_type": "ERC721", "name": "Iconic Apes", "symbol": "IAPES", "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmR73rRPpg8CEhH5wTGewVAQQNEEF4mGqVdx1ovaFAW7uA/2", "metadata": { "name": "Iconic Apes #2", "description": "31 Unique Iconic Apes", "image": "ipfs://QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/02.png", "attributes": [{ "trait_type": "Background", "value": "(64)" }] }, "last_token_uri_sync": "2022-07-18T03:46:36.042Z", "last_metadata_sync": "2022-07-18T03:46:48.915Z", "image": "https://gateway.ipfs.io/ipfs/QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/02.png" }, { "token_address": "0x412af954e521f17fa13cd8f2983a1e612db6bb2b", "token_id": "22", "amount": "1", "token_hash": "feedcaee9a4bcb4a86d8faa307a66cf2", "block_number_minted": "17471564", "updated_at": null, "contract_type": "ERC721", "name": "Iconic Apes", "symbol": "IAPES", "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmR73rRPpg8CEhH5wTGewVAQQNEEF4mGqVdx1ovaFAW7uA/22", "metadata": { "name": "Iconic Apes #22", "description": "31 Unique Iconic Apes", "image": "ipfs://QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/22.png", "attributes": [{ "trait_type": "Background", "value": "(76)" }] }, "last_token_uri_sync": "2022-07-18T03:46:32.629Z", "last_metadata_sync": "2022-07-18T03:46:36.673Z", "image": "https://gateway.ipfs.io/ipfs/QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/22.png" }, { "token_address": "0x412af954e521f17fa13cd8f2983a1e612db6bb2b", "token_id": "14", "amount": "1", "token_hash": "e82774b14783c013bc04c6ff3c369c54", "block_number_minted": "17471564", "updated_at": null, "contract_type": "ERC721", "name": "Iconic Apes", "symbol": "IAPES", "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmR73rRPpg8CEhH5wTGewVAQQNEEF4mGqVdx1ovaFAW7uA/14", "metadata": { "name": "Iconic Apes #14", "description": "31 Unique Iconic Apes", "image": "ipfs://QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/14.png", "attributes": [{ "trait_type": "Background", "value": "(48)" }] }, "last_token_uri_sync": "2022-07-18T03:46:36.043Z", "last_metadata_sync": "2022-07-18T03:50:34.754Z", "image": "https://gateway.ipfs.io/ipfs/QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/14.png" }, { "token_address": "0x412af954e521f17fa13cd8f2983a1e612db6bb2b", "token_id": "29", "amount": "1", "token_hash": "dfae76e9bb51d006e7a10bcdd200df65", "block_number_minted": "17471564", "updated_at": null, "contract_type": "ERC721", "name": "Iconic Apes", "symbol": "IAPES", "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmR73rRPpg8CEhH5wTGewVAQQNEEF4mGqVdx1ovaFAW7uA/29", "metadata": { "name": "Iconic Apes #29", "description": "31 Unique Iconic Apes", "image": "ipfs://QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/29.png", "attributes": [{ "trait_type": "Background", "value": "(52)" }] }, "last_token_uri_sync": "2022-07-18T03:46:36.041Z", "last_metadata_sync": "2022-07-18T03:46:48.915Z", "image": "https://gateway.ipfs.io/ipfs/QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/29.png" }, { "token_address": "0x412af954e521f17fa13cd8f2983a1e612db6bb2b", "token_id": "16", "amount": "1", "token_hash": "df204eac4717fb23c510d72589202f09", "block_number_minted": "17471564", "updated_at": null, "contract_type": "ERC721", "name": "Iconic Apes", "symbol": "IAPES", "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmR73rRPpg8CEhH5wTGewVAQQNEEF4mGqVdx1ovaFAW7uA/16", "metadata": { "name": "Iconic Apes #16", "description": "31 Unique Iconic Apes", "image": "ipfs://QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/16.png", "attributes": [{ "trait_type": "Background", "value": "(37)" }] }, "last_token_uri_sync": "2022-07-18T03:46:32.629Z", "last_metadata_sync": "2022-07-18T03:46:36.672Z", "image": "https://gateway.ipfs.io/ipfs/QmbR9QA5BhN6JxM4PYDevMWjPmcXfZDsWHt4BF9kbzHXLu/16.png" }]';

export const useNFTBalance = (options) => {
  const { account } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [NFTBalance, setNFTBalance] = useState([]);
  const {
    fetch: getNFTBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTs, { chain: chainId, ...options });
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(async () => {
    if (data?.result) {
      const NFTs = data.result;
      setFetchSuccess(true);
      for (let NFT of NFTs) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          NFT.image = resolveLink(NFT.metadata?.image);
        } else if (NFT?.token_uri) {
          try {
            await fetch(NFT.token_uri)
              .then((response) => response.json())
              .then((data) => {
                NFT.image = resolveLink(data.image);
              });
          } catch (error) {
            setFetchSuccess(false);
          }
        }
      }
      // setNFTBalance();
      setNFTBalance(NFTs);
      // setNFTBalance(JSON.parse(blanceData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getNFTBalance, NFTBalance, fetchSuccess, error, isLoading };
};
