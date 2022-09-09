import React, { useState, useEffect, useRef } from 'react';

import { Alert, Image, Badge, Card, Select, Spin, CheckCircleOutlined } from 'antd'
import { useNFTTokenIds } from "../../hooks/useNFTTokenIds";

import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";

import { config } from "../../config";
import {
    useMoralisQuery,
} from "react-moralis";

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadNft, setActiveNft } from 'redux/actions/nftActions';
import './nft.css'
import Tick from './Tick';
import { toggleMenu, setActionMenu } from 'redux/actions/menuActions';
import { useMoralisWeb3Api } from "react-moralis";
import { AvaxLogo } from "components/Chains/Logos";

import Search from './Search';
import { useIPFS } from 'hooks/useIPFS';
import { useMoralis } from "react-moralis";


const { Option } = Select
const { Meta } = Card;


const styles = {
    banner: {
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        margin: "0 auto",
        width: "600px",
        //borderRadius: "10px",
        height: "150px",
        marginBottom: "40px",
        paddingBottom: "20px",
        borderBottom: "solid 1px #e3e3e3",
        backgroundColor: "#191e2b",
        color: "#fff"
    },
    logo: {
        height: "115px",
        width: "115px",
        borderRadius: "50%",
        // positon: "relative",
        // marginTop: "-80px",
        border: "solid 4px white",
    },
    text: {
        color: "#041836",
        fontSize: "27px",
        fontWeight: "bold",
        backgroundColor: "#191e2b",
        color: "#fff"
    },
    cardText: {
        fontSize: "14px",
        fontWeight: "bold",
        backgroundColor: "#191e2b",
        color: "#fff"
    },
    cardDescriptionF: {
        fontSize: "14px",
        fontWeight: "bold",
        backgroundColor: "#191e2b",
        color: "#fff"
    }

};

const fallbackImg =
    "data:image/png;base64,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";



const Index = ({ inputValue, setNftToBuy, setVisibility }) => {


    const listInnerRef = useRef();

    const [filter, setfilter] = useState('a-z');
    const [limit, setlimit] = useState('20');
    const [prevCursor, setprevCursor] = useState(null);
    const [nextCursor, setnextCursor] = useState(null);
    const [activeCursor, setactiveCursor] = useState(null);
    const [search, setSearch] = useState('')


    const { collection, data } = useSelector(state => state.nft);

    let { NFTTokenIds, totalNFTs, fetchSuccess, fetchCursor, isLoading } = useNFTTokenIds(collection.addrs, activeCursor, limit, search);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const Moralis = useMoralis();
    // const { resolveLink } = useIPFS();

    useEffect(() => {
        dispatch(loadNft(NFTTokenIds))
    }, [JSON.stringify(NFTTokenIds)]);


    useEffect(() => {
        setprevCursor(nextCursor);
        setnextCursor(fetchCursor);
    }, [fetchCursor])



    const getMarketItem = (nft) => {
        const result = fetchMarketItems?.find(
            (e) =>
                e.nftContract === nft?.token_address &&
                e.tokenId === nft?.token_id &&
                e.sold === false && e.canceled == false
        );
        return result;
    };

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
            "canceled"
        ])
    );

    const handleChange = (e) => {
        setfilter(e)
    }

    const getLowestPrice = (address) => {
        let price = 0;
        const result = fetchMarketItems?.filter(
            (e) => e.nftContract === address && e.canceled == false
        );
        result.map((item) => {
            let tempPrice = item.price / ("1e" + 18);
            if (tempPrice && !price) {
                price = tempPrice
            } else if (price && price > tempPrice) {
                price = tempPrice;
            }
        })
        return price;
    };

    // const loadData = async (address, limit, offset, filter) => {

    //     const data = await getCustomNftz(address, limit, offset, filter);
    //     console.log(data);
    // }


    // useEffect(() => {
    //     // loadData(collection.addrs, 10, 10, 'sdfsf')
    // }, [collection])




    // const getCustomNftz = async (addr, limit, offset) => {



    //     let res = await fetchData(addr, limit, offset);
    //     if (res) {
    //         for (let NFT of res) {
    //             if (NFT?.metadata) {
    //                 NFT.metadata = JSON.parse(NFT.metadata);
    //                 NFT.image = resolveLink(NFT.metadata?.image);
    //             } else if (NFT?.token_uri) {
    //                 try {
    //                     await fetch(NFT.token_uri)
    //                         .then((response) => response.json())
    //                         .then((data) => {
    //                             NFT.image = resolveLink(data.image);
    //                         });
    //                 } catch (error) {

    //                 }
    //             }

    //         }
    //     }
    // }




    // const fetchData = async ({ address, limit, offset, filter }) => {

    //     const NFTMetadata = Moralis.Object.extend("nftmetadata");
    //     const query = new Moralis.Query(NFTMetadata);
    //     query.equalTo("token_address", address);
    //     const results = await query.find();
    //     // Do something with the returned Moralis.Object values

    //     let temp = [];
    //     let start = offset + limit - 1;
    //     let end = start + limit;
    //     for (let i = start; i < end; i++) {
    //         let details = results[i];
    //         temp.push({
    //             token_id: details.get('token_id'),
    //             token_address: details.get('token_address'),
    //             amount: details.get('amount'),
    //             contract_type: details.get('contract_type'),
    //             name: details.get('name'),
    //             symbol: details.get('symbol'),
    //             metadata: details.get('metadata'),
    //             token_uri: details.get('token_uri'),
    //             updated_at: details.get('updatedAt')
    //         })

    //     }
    //     return temp;
    // }



    return (<>
        {!fetchSuccess && (
            <>
                <Alert
                    message="Unable to fetch all NFT metadata... We are searching for a solution, please try again later!"
                    type="warning"
                />
                <div style={{ marginBottom: "10px" }}></div>
            </>
        )}

        <div className='collection-header'>
            <div className='banner-image-block'>
                <div className='banner-image-inner'>
                    <div className='banner-image-inner-block'>
                        <img alt="pax.world land" src="https://lh3.googleusercontent.com/yONz-y9p_wciFKamhRof_ed72FV9x4RcuSH9-j9gtofw94NPgeW3V0SxzVtWWM8PXXGedoNng1CXh3y6AptemGJnbw4F4NGNDmOQ9g=h600" decoding="async" data-nimg="fill" />


                    </div>

                </div>



            </div>
            <div className='row collection-params'>
                <div className='col-sm-6 offset-2 row'>
                    <div className='col-sm-3 d-flex flex-column align-items-center justify-content-center'>
                        <span className='collection-label'>{totalNFTs}</span>
                        <span className='collection-value'>Items</span>
                    </div>
                    <div className='col-sm-3 d-flex flex-column align-items-center justify-content-center'>
                        <label className='collection-label'>
                            <AvaxLogo />  {getLowestPrice(collection.addrs)}
                        </label>
                        <label className='collection-value'>Floor Price</label>
                    </div>
                </div>

            </div>

            <div className='collection-image-container'>
                <img src={collection?.image} className="collection-image" />
            </div>
        </div>
        <div className='collection-name-row'>
            <div className='row'>
                <div className='collection-name'> {collection?.name}</div>
                <Tick />
            </div>
        </div>
        {collection.description != '' && <div className='collection-description'>
            {collection.description}
        </div>}

        <div className='row col-12 nft-collection-page' >

            <div className='col-sm-12 '>
                <div className='row col-sm-12'>
                    {/* <div className='col-sm-2'>

                    </div> */}
                    <div className='col-sm-12'>
                        <div className='col-sm-12 row  d-flex justify-content-end'>
                            <div className='col-sm-3'>
                                <Search search={search} setSearch={setSearch} />
                            </div>

                            <div className='col-sm-4 select-filter-outline'>
                                <Select
                                    defaultValue="pricelh"
                                    className='w-100'
                                    onChange={handleChange}


                                >
                                    <Option value="pricelh">Price Low To High</Option>
                                    <Option value="pricehl">Price High To Low</Option>


                                </Select>
                            </div>



                        </div>
                        {isLoading && <div className='col-sm-12 d-flex align-items-center justify-content-center h-100'> <Spin /></div>}

                        <div className='row p-3'>
                            {data.map((nft, index) => {
                                let item = getMarketItem(nft);
                                return <div className='col-sm-3'
                                    onClick={() => {
                                        dispatch(setActiveNft(nft));
                                        // console.log('safsdlfkajlskdjfa');
                                        dispatch(setActionMenu({
                                            nft,
                                            action: 'info'
                                        }))

                                        // navigate('/nft');
                                    }}
                                    index={index}
                                >
                                    <div className='nft-body'>
                                        <Image
                                            preview={false}
                                            src={nft.image || "error"}
                                            fallback={fallbackImg}
                                            className="nft-image"
                                            alt=""
                                            style={{ height: "420px" }}
                                            onFocus={() => console.log('image focused')}
                                        />

                                        {/* {getMarketItem(collection) && (
                                            <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
                                        )} */}
                                        <div className='row d-flex flex-row collection-nft-description '>
                                            <span className='col-sm-6' >{nft.name} - {`#${nft.token_id}`}</span>


                                            {item && <span className='col-sm-6'> <AvaxLogo /> {item.price / ("1e" + 18)}</span>}
                                        </div>


                                    </div>
                                </div>

                            })}
                            <div className='loadmore d-flex justify-content-center align-items-center align-content-center'>
                                <div onClick={() => setactiveCursor(nextCursor)} className="load-more"> Load More</div>
                            </div>
                        </div>

                    </div>

                </div>



            </div>
        </div>

    </>
    );
};

export default Index;