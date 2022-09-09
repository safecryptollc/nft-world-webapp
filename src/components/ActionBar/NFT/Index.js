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
import { Navigate } from 'react-router-dom';

const Index = ({ route, navigation }) => {

    const { nft, fromMobile } = useSelector(state => state.actionMenu);

    const { collection } = useSelector(state => state.nft);

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
            'canceled'
        ])
    );
    const getMarketItem = (nft) => {
        const result = fetchMarketItems?.find(
            (e) =>
                e.nftContract === nft?.token_address &&
                e.tokenId === nft?.token_id &&
                e.sold === false && e.canceled == false
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
                setLoading(false);
                setVisible(false);
                updateSoldMarketItem();
                succPurchase();
            },
            onError: (error) => {
                console.log(error);
                setLoading(false);
                failPurchase(error);
            },
        }).catch(error => {
            failPurchase(error);
        });
    }

    function failPurchase(error) {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: "Error!",
            content: `Please make sure you are on avax network and have required amount plus gass fee in balance `,
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

        const NFTMetadata = Moralis.Object.extend("nftmetadata");
        const metaquery = new Moralis.Query(NFTMetadata);
        metaquery.equalTo("token_address", nft.token_address.toLowerCase());
        metaquery.equalTo("token_id", String(nft.token_id));
        await metaquery.first().then((obj) => {
            obj.set('listed', false);
            obj.set('owner', walletAddress);
            obj.save();
        });


        const Approve = Moralis.Object.extend(config.moralisApprovedTableName);
        const approveQuery = new Moralis.Query(Approve);
        approveQuery.equalTo("token_address", nft.token_address.toLowerCase());
        approveQuery.equalTo("token_id", String(nft.token_id));
        await approveQuery.first().then((obj) => {
            obj.set('status', false);
            obj.save();
        });

    }

    const handleClick = () => {
        dispatch(toggleMenu())
    };



    return (
        <>
            <div className='close-block'>
                {fromMobile && <a href='/market'>
                    <div className='close-button'>
                        Market
                    </div>
                </a>
                }
                {!fromMobile && <div className='close-button' onClick={handleClick}>
                    X
                </div>}
            </div>
            <div className='container col'>
                <div className='col-sm-12 image-container '>
                    <img className="nft-image" src={nft.image} alt="Image"
                        style={{ width: '100%', height: '100%' }}
                    />

                </div>
                <div className='col-sm-12'>
                    <span className="nft-name">{nft?.metadata?.name}</span>
                    <div className='buy-block'>
                        {nft.listed && <>
                            <span className='buy-price'>{nft.price / ("1e" + 18) + ' AVAX'}</span>

                            <div className='buy-button' onClick={() => {
                                purchase();
                            }}>
                                {!loading && 'Buy Now'}
                                {loading && <Spin />}
                            </div></>
                        }

                        {!nft.listed && <>
                            <div className='notfor-sale'>
                                Not for sale
                            </div>
                        </>}

                    </div>

                    {/* {collection.description && <div className='nft-description'>

                        The Book Games are a first-of-its-kind Layer 2 NFT created by Gary Vaynerchuk, linking to his best-selling book, Twelve and a Half. Before embarking on this journey, players must remember...BOOK GAMES IS PLAYED FOREVER! Each token grants the holder special opportunities within the VeeFriends universe. Visit veefriends.com/bookgames to connect your wallet and play.
                    </div>} */}

                    {/* <div className='row mt-3'>
                        <div className='col-sm-3 d-flex flex-column align-items-center justify-content-center'>
                            <span className='attrib-triat'> Color </span>
                            <span className='attrib-value'> White </span>
                        </div>

                        <div className='col-sm-3 d-flex flex-column align-items-center justify-content-center'>
                            <span className='attrib-triat'> Color </span>
                            <span className='attrib-value'> White </span>
                        </div>
                    </div> */}

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

            </div>
        </>



    );
};




export default Index;