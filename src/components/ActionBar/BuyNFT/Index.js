import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from 'redux/actions/menuActions';
import { useMoralis, useMoralisQuery } from "react-moralis";
import { config } from "config";


import './buy.css'
import 'components/NFT/nft.css'
const BuyNft = () => {
    const { nft } = useSelector(state => state.nft);


    const dispatch = useDispatch();

    const { Moralis } = useMoralis();

    const queryMarketItems = useMoralisQuery(config.moralisTableName);
    const fetchMarketItems = JSON.parse(
        JSON.stringify(queryMarketItems.data, [
            "objectId",
            "createdAt",
            "price",
            "nftContract",
            "itemId",
            "sold",
            "tokenId",
            "seller",
            "owner",
            "confirmed",
        ])
    );
    const getMarketItem = (nft) => {
        const result = fetchMarketItems?.find(
            (e) =>
                e.nftContract === nft?.token_address &&
                e.tokenId === nft?.token_id &&
                e.sold === false
        );
        return result;
    };
    const nftMarketData = getMarketItem(nft)

    if (nft == null || !nft) {
        return <div className='container mt-5'>
            Invalid NFT
        </div>
    }


    return <div className='buy-block'>

        <span className="nft-name">{nft.metadata.name}</span>
        <span className="nft-tokenid">{nft.token_id}</span>
        <span className="ft-owned-by ">{nft.token_address}</span>
        <div className='nft-description'>
            {/* <span>{JSON.stringify(nft)}</span> */}
            The Book Games are a first-of-its-kind Layer 2 NFT created by Gary Vaynerchuk, linking to his best-selling book, Twelve and a Half. Before embarking on this journey, players must remember...BOOK GAMES IS PLAYED FOREVER! Each token grants the holder special opportunities within the VeeFriends universe. Visit veefriends.com/bookgames to connect your wallet and play.
        </div>

        <div className='buy-block'>
            {nftMarketData && <>
                {/* <span className='buy-price'>{nftMarketData!=null ? nftMarketData.price : '0'} AVAX</span> */}
                <span className='buy-price'>{nftMarketData.price / ("1e" + 18) + ' AVAX'}</span>
                <div className='buy-button' onClick={() => {
                    dispatch(toggleMenu())
                }}>
                    Buy Now
                </div></>
            }

            {!nftMarketData && <>
                <div className='notfor-sale'>
                    Not for sale
                </div>
            </>}

        </div>

    </div>
}

export default BuyNft;