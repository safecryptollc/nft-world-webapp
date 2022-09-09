import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './nft.css'
import { config } from "config";
import { getNativeByChain } from "helpers/networks";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { Card, Modal, Badge, Alert, Spin } from "antd";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";
import { toggleMenu } from 'redux/actions/menuActions';


const Index = ({ route, navigation }) => {

    const { nft } = useSelector(state => state.nft);

    const dispatch = useDispatch();

    const { Moralis } = useMoralis();

    const contractProcessor = useWeb3ExecuteFunction();
    const { chainId, marketAddress, contractABI, walletAddress } =
        useMoralisDapp();
    const nativeName = getNativeByChain(chainId);
    const contractABIJson = JSON.parse(contractABI);


    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

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
    const purchaseItemFunction = "createMarketSale";
    async function purchase() {
        setLoading(true);
        const tokenDetails = getMarketItem(nft);
        const itemID = tokenDetails.itemId;
        const tokenPrice = tokenDetails.price;

        const ops = {
            contractAddress: marketAddress,
            functionName: purchaseItemFunction,
            abi: contractABIJson,
            params: {
                nftContract: nft.token_address,
                itemId: itemID,
            },
            msgValue: tokenPrice,
        };

        await contractProcessor.fetch({
            params: ops,
            onSuccess: () => {
                console.log("success");
                setLoading(false);
                setVisible(false);
                updateSoldMarketItem();
                succPurchase();
            },
            onError: (error) => {
                setLoading(false);
                failPurchase();
            },
        });
    }

    function failPurchase() {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: "Error!",
            content: `There was a problem when purchasing this NFT`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    function succPurchase() {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: "Success!",
            content: `You have purchased this NFT`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }


    async function updateSoldMarketItem() {
        const id = getMarketItem(nft).objectId;
        const marketList = Moralis.Object.extend(config.moralisTableName);
        const query = new Moralis.Query(marketList);
        await query.get(id).then((obj) => {
            obj.set("sold", true);
            obj.set("owner", walletAddress);
            obj.save();
        });
    }

    return (
        <div className='container col row'>
            <div className='col-sm-6 image-container '>
                <img className="nft-image" src={nft.image} alt="Image" />

            </div>
            <div className='col-sm-6'>
                <span className="nft-name">{nft.metadata.name}</span>
                <span className="nft-tokenid">{nft.token_id}</span>
                <span className="ft-owned-by ">{nft.token_address}</span>

                <div className='buy-block'>
                    {nftMarketData && <>
                        {/* <span className='buy-price'>{nftMarketData!=null ? nftMarketData.price : '0'} AVAX</span> */}
                        <span className='buy-price'>{Moralis.Units.FromWei(nftMarketData.price) + ' AVAX'}</span>
                        <div className='buy-button' onClick={() => {
                            // dispatch(toggleMenu())
                            setVisible(true)
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

                <div className='nft-description'>
                    {/* <span>{JSON.stringify(nft)}</span> */}
                    The Book Games are a first-of-its-kind Layer 2 NFT created by Gary Vaynerchuk, linking to his best-selling book, Twelve and a Half. Before embarking on this journey, players must remember...BOOK GAMES IS PLAYED FOREVER! Each token grants the holder special opportunities within the VeeFriends universe. Visit veefriends.com/bookgames to connect your wallet and play.
                </div>

                <div className='attributes'>
                    <div className='attrib'>
                        <span className='attrib-triat'> Color </span>
                        <span className='attrib-value'> White </span>
                    </div>
                    <div className='attrib'>
                        <span className='attrib-triat'> Color </span>
                        <span className='attrib-value'> White </span>
                    </div>
                    <div className='attrib'>
                        <span className='attrib-triat'> Color </span>
                        <span className='attrib-value'> White </span>
                    </div>
                    <div className='attrib'>
                        <span className='attrib-triat'> Color </span>
                        <span className='attrib-value'> White </span>
                    </div>
                    <div className='attrib'>
                        <span className='attrib-triat'> Color </span>
                        <span className='attrib-value'> White </span>
                    </div>
                    <div className='attrib'>
                        <span className='attrib-triat'> Color </span>
                        <span className='attrib-value'> White </span>
                    </div>
                    <div className='attrib'>
                        <span className='attrib-triat'> Color </span>
                        <span className='attrib-value'> White </span>
                    </div>
                </div>

            </div>

            <Modal
                title={`Buy ${nft?.name} #${nft?.token_id}`}
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={() => purchase()}
                okText="Buy"
            >
                <Spin spinning={loading}>
                    <div
                        style={{
                            width: "250px",
                            margin: "auto",
                        }}
                    >
                        <Badge.Ribbon
                            color="green"
                            text={nftMarketData ? Moralis.Units.FromWei(nftMarketData.price) + 'AVAX' : ''}
                        >
                            <img
                                src={nft?.image}
                                style={{
                                    width: "250px",
                                    borderRadius: "10px",
                                    marginBottom: "15px",
                                }}
                            />
                        </Badge.Ribbon>
                    </div>
                </Spin>
            </Modal>

        </div >


    );
};




export default Index;