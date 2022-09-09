import { getCollectionsByChain } from 'helpers/collections';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setCollection, setActiveNft } from 'redux/actions/nftActions';
import { useMoralis, useMoralisQuery } from "react-moralis";

import { setActionMenu } from 'redux/actions/menuActions';
import { useDispatch } from 'react-redux';
import { useIPFS } from 'hooks/useIPFS';


const FromApp = () => {

    const { Moralis, isInitialized } = useMoralis();
    const dispatch = useDispatch();
    const { resolveLink } = useIPFS();

    var { collectionId, tokenId } = useParams();

    const setParmas = async () => {
        let collections = getCollectionsByChain('0xa86a');
        let colletion = collections.find(x => x.addrs === collectionId);
        let token = await getToken(collectionId, tokenId);

        if (colletion && token) {
            dispatch(setCollection(colletion))
            dispatch(setActiveNft(token))
            dispatch(setActionMenu({
                nft: token,
                action: 'info',
                fromMobile: true
            }))

        }
    }

    const getToken = async (address, tokenId) => {
        const NFTMetadata = Moralis.Object.extend("nftmetadata");
        const metaquery = new Moralis.Query(NFTMetadata);
        metaquery.equalTo("token_address", address.toLowerCase());
        metaquery.equalTo("token_id", String(tokenId));
        return await metaquery.first().then(async (result) => {
            let data = await result.fetch();
            let temp = { ...data.attributes }
            if (temp?.metadata) {
                temp.metadata = JSON.parse(temp.metadata);
                temp.image = resolveLink(temp.metadata?.image);
            } else if (temp.token_uri) {
                try {
                    await fetch(temp.token_uri)
                        .then((response) => response.json())
                        .then((data) => {
                            temp.image = resolveLink(data.image);
                        });
                } catch (error) {

                }
            }
            return temp;





        });
    }
    useEffect(() => {
        if (isInitialized) {
            setParmas();
        }

    }, [collectionId, tokenId, isInitialized])
    return (
        <></>
    );
};

export default FromApp;
