import React, { useEffect, useState } from 'react';
import { Image, Modal, Input, Spin, Button } from "antd";

import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralis } from "react-moralis";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useWeb3ExecuteFunction } from "react-moralis";
import { config } from "config";

const fallbackImg =
    "data:image/png;base64,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";



const Index = ({ nft, index }) => {


    const { chainId, marketAddress, contractABI, walletAddress } =
        useMoralisDapp();
    const { Moralis } = useMoralis();


    const [approved, setApproved] = useState(false);
    const [listed, setListed] = useState(false);
    const [price, setPrice] = useState(0);

    const [loading, setLoading] = useState(false);
    const [visible, setvisible] = useState(false);

    const contractProcessor = useWeb3ExecuteFunction();
    const contractABIJson = JSON.parse(contractABI);
    const listItemFunction = "createMarketItem";

    const ItemImage = Moralis.Object.extend("ItemImages");



    const updateStatus = async () => {
        setLoading(true);

        const Approved = Moralis.Object.extend(config.moralisApprovedTableName);
        let query = new Moralis.Query(Approved);
        query.equalTo("token_address", nft.token_address);
        query.equalTo("token_id", nft.token_id);
        query.equalTo("status", true);
        let results = await query.first();
        if (results) {
            setApproved(true);
        } else {
            setApproved(false);
        }

        const MarketItems = Moralis.Object.extend(config.moralisTableName);
        query = new Moralis.Query(MarketItems);
        query.equalTo("token_address", nft.token_address);
        query.equalTo("token_id", nft.token_id);
        query.equalTo("sold", false);
        query.equalTo("canceled", false);
        results = await query.first();
        if (results) {
            setListed(true);
        } else {
            setListed(false);
        }

        setLoading(false);
    }

    useEffect(() => {
        updateStatus();
    }, [])



    const approveNft = async () => {
        setLoading(true);
        const ops = {
            contractAddress: nft.token_address,
            functionName: "setApprovalForAll",
            abi: [
                {
                    inputs: [
                        { internalType: "address", name: "operator", type: "address" },
                        { internalType: "bool", name: "approved", type: "bool" },
                    ],
                    name: "setApprovalForAll",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
            ],
            params: {
                operator: marketAddress,
                approved: true,
            },
        };

        await contractProcessor.fetch({
            params: ops,
            onSuccess: (data) => {
                updateMoralisItemConfirmed(nft);
                updateStatus();
                succApprove();
                setLoading(false);

            },
            onError: (error) => {
                setLoading(false);
                failApprove();
            },
        });
    }


    function succApprove() {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: "Success!",
            content: `Approval is now set, you may list your NFT`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }


    function failApprove() {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: "Error!",
            content: `There was a problem with setting approval`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    const updateMoralisItemConfirmed = async () => {
        const Approved = Moralis.Object.extend(config.moralisApprovedTableName);
        const query = new Approved();
        await query.save({
            token_id: nft.token_id,
            token_address: nft.token_address,
            status: true,
            did_by: walletAddress,
        });
    }


    const list = async () => {
        setLoading(true);
        const p = Moralis.Units.ETH(price);
        const ops = {
            contractAddress: marketAddress,
            functionName: listItemFunction,
            abi: contractABIJson,
            params: {
                nftContract: nft.token_address,
                tokenId: nft.token_id,
                price: String(p),
            },
        };

        await contractProcessor.fetch({
            params: ops,
            onSuccess: () => {
                addToMetaData({ ...nft, price: p });
            },
            onError: (error) => {
                setLoading(false);
                failList();
            },
        });
    }

    async function addToMetaData(nft) {
        const NFTMetadata = Moralis.Object.extend("nftmetadata");
        const metaquery = new Moralis.Query(NFTMetadata);
        metaquery.equalTo("token_address", nft.token_address.toLowerCase());
        metaquery.equalTo("token_id", String(nft.token_id));
        await metaquery.first().then((obj) => {
            obj.set("listed", true);
            obj.set("owner", marketAddress);
            obj.set("price", String(nft.price));
            obj.save();
            setLoading(false);
            setvisible(false);
            addItemImage();
            succList();
            updateStatus();
        });
    }
    function succList() {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: "Success!",
            content: `Your NFT was listed on the marketplace`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    function failList() {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: "Error!",
            content: `There was a problem listing your NFT`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }
    function addItemImage() {
        const itemImage = new ItemImage();

        itemImage.set("image", nft.image);
        itemImage.set("nftContract", nft.token_address);
        itemImage.set("tokenId", nft.token_id);
        itemImage.set("name", nft.name);

        itemImage.save();
    }

    return (
        [<div className="col-sm-3" index={index}>
            <div className="nft-body">
                <Image
                    preview={false}
                    src={nft.image || "error"}
                    fallback={fallbackImg}
                    className="nft-image"
                    alt=""
                    style={{ height: "300px" }}
                />

                <div className="row d-flex flex-row collection-nft-description ">
                    <span className="col-sm-6">
                        {nft.name} - {`#${nft.token_id}`}{" "}
                    </span>
                    {!listed && <div className="col-sm-6 d-flex flex-row align-items-center justify-content-center align-content-lg-around">
                        {!approved && (
                            <div className="btn btn-sm btn-warning"
                                onClick={() => approveNft()}
                            >
                                Approve
                            </div>
                        )}

                        {approved && (
                            <div
                                className="btn btn-sm btn-success"
                                onClick={() => setvisible(true)}
                            >
                                <FontAwesomeIcon icon={faCartShopping} />
                                List on Market
                            </div>
                        )}
                    </div>}

                    {listed &&
                        <div className="col-sm-6 d-flex flex-row align-items-center justify-content-center align-content-lg-around">
                            <span>
                                <label style={{ fontSize: 12 }}>Listed </label>
                                <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: 12, marginLeft: 5 }} />

                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>,

        <Modal
            title={`List ${nft?.name} #${nft?.token_id} For Sale`}
            visible={visible}
            onCancel={() => setvisible(false)}
            onOk={() => list(nft, price)}
            okText="List"
            footer={[
                <Button onClick={() => setvisible(false)}>Cancel</Button>,
                <Button onClick={() => list(nft, price)} type="primary">List</Button>

            ]}
        >
            <Spin spinning={loading}>
                <img
                    src={`${nft?.image}`}
                    style={{
                        width: "250px",
                        margin: "auto",
                        borderRadius: "10px",
                        marginBottom: "15px",
                    }}
                />
                <Input
                    autoFocus
                    placeholder="Listing Price in AVAX"
                    disabled={!approved}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </Spin>
        </Modal>
        ]
    );
};

export default Index;