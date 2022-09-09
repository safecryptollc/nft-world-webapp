import React, { useState, useEffect, useRef } from 'react';

import { Alert, Image, Badge, Card, Select, Spin, CheckCircleOutlined } from 'antd'
import { useNFTTokenIds } from "../../hooks/useNFTTokenIds";
import { config } from "../../config";
import { useMoralisQuery } from "react-moralis";

import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadNft, setActiveNft, resetNftData, updateNft } from 'redux/actions/nftActions';
import './nft.css'
import Tick from './Tick';
import { setActionMenu } from 'redux/actions/menuActions';
import { getCollectionsByChain } from "../../helpers/collections";


import { AvaxLogo } from "components/Chains/Logos";
import { setCollection } from "redux/actions/nftActions";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
// import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

import { LazyLoadImage } from 'react-lazy-load-image-component';

import 'react-lazy-load-image-component/src/effects/blur.css';
import Search from './Search';
import { useIPFS } from 'hooks/useIPFS';
import { useMoralis } from "react-moralis";

import LazyLoad from 'react-lazy-load';


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



    const [filter, setfilter] = useState('pricehl');
    const [limit, setlimit] = useState(50);

    const [search, setSearch] = useState('');
    const [loading, setloading] = useState(false);
    const [loadmoreloading, setloadmoreloading] = useState(false);
    const [sortChanged, setsortChanged] = useState(false);

    const [nftz, setntz] = useState([]);

    const { collection, data, isMobile } = useSelector(state => state.nft);

    useEffect(() => {
        dispatch(resetNftData([]));
    }, [])

    let { NFTTokenIds, totalNFTs, fetchSuccess, fetchCursor, isLoading } = useNFTTokenIds(collection.addrs, null, limit, search);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { Moralis } = useMoralis();
    const { resolveLink } = useIPFS();

    useEffect(() => {
        dispatch(loadNft(NFTTokenIds))
    }, [JSON.stringify(NFTTokenIds)]);


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
        setfilter(e);
        setlimit(50);
        setsortChanged(true);
    }

    const getLowestPrice = (address) => {
        let price = 0;

        const result = fetchMarketItems?.filter(
            (e) => e.nftContract.toString().toLowerCase() === address.toString().toLowerCase() && e.canceled == false && e.sold == false
        );
        result.map((item) => {

            let tempPrice = Moralis.Units.FromWei(item.price);
            if (tempPrice && !price) {
                price = tempPrice
            } else if (price && price > tempPrice) {
                price = tempPrice;
            }
        })
        return price;
    };

    const loadData = async (address, limit, search, filter, type) => {
        setloading(true);
        let data = await getCustomNftz(address, limit, search, filter);
        data.map((da, index) => {
            data[index].price = parseFloat(da.price)
        })
        if (filter === 'pricehl') {
            data = data.sort((a, b) => a.price > b.price ? -1 : 1)
        } else if (search == '') {
            data = data.sort((a, b) => {
                return (a.price > b.price) && b.price != '0' ? 1 : -1;
            })
        }

        setloading(false);
        setloadmoreloading(false);
        if (type == 'auto') {
            dispatch(updateNft(data));
        } else {
            dispatch(loadNft(data));
        }

    }
    useEffect(() => {
        loadData(collection.addrs, limit, search, filter, 'auto')
    }, [collection, search, limit, filter])

    const getCustomNftz = async (addr, limit, search, filter) => {
        setloading(true);
        let res = await fetchData(addr, limit, search, filter);
        if (res.length) {
            for (let NFT of res) {
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

                    }
                }

            }
        }
        return res;
        // if (search != '' || sortChanged) {
        //     dispatch(updateNft(res));
        // } else {
        //     dispatch(loadNft(res));
        // }


    }




    const fetchData = async (address, limit, search, filter) => {
        const NFTMetadata = Moralis.Object.extend("nftmetadata");
        const query = new Moralis.Query(NFTMetadata);
        query.equalTo("token_address", address.toLowerCase());

        if (filter == 'pricehl') {
            query.descending("price");
        } else {
            query.ascending("price");

        }
        if (limit >= totalNFTs) {
            limit = parseInt(totalNFTs);
            console.log('limit ' + limit);
        }
        query.skip((limit - 50) <= 0 ? 0 : (limit - 50))
        query.limit(limit);

        if (search != '') {
            query.startsWith('token_id', search);
            query.skip(0);
            query.limit(50);

        }
        const results = await query.find();
        // Do something with the returned Moralis.Object values
        let temp = [];

        for (let i = 0; i < results.length; i++) {
            let details = results[i];
            temp.push({
                token_id: details.get('token_id'),
                token_address: details.get('token_address').toLowerCase(),
                amount: details.get('amount'),
                contract_type: details.get('contract_type'),
                name: details.get('name'),
                symbol: details.get('symbol'),
                metadata: details.get('metadata'),
                token_uri: details.get('token_uri'),
                updated_at: details.get('updatedAt'),
                price: details.get('price'),
                listed: details.get('listed')
            })

        }
        // if (search != '') {
        //     temp = temp.filter(e => e.name.includes(search) || e.token_id.includes(search))
        // }
        // if (filter != '') {
        //     if (filter == 'pricehl') {
        //         temp.sort((a, b) => a.price > b.price ? -1 : 1);
        //     } else {
        //         temp.sort((a, b) => a.price > b.price ? 1 : 1);

        //     }
        // }
        // if (limit != '') {
        //     temp.slice(0, limit);
        // }
        return temp;
    }



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

        <div className='collection-header'
            style={isMobile ? { marginTop: '60px' } : {}}
        >
            <div className='banner-image-block'>
                <div className='banner-image-inner'>
                    <div className='banner-image-inner-block'>
                        <img alt="pax.world land" src={collection?.banner || 'https://lh3.googleusercontent.com/yONz-y9p_wciFKamhRof_ed72FV9x4RcuSH9-j9gtofw94NPgeW3V0SxzVtWWM8PXXGedoNng1CXh3y6AptemGJnbw4F4NGNDmOQ9g=h600'} decoding="async" data-nimg="fill" />


                    </div>

                </div>



            </div>
            <div className={!isMobile ? 'row collection-params' : ''}>
                <div className={!isMobile ? 'col-sm-6 offset-2 row' : 'col-sm-6'}>
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

            <div className={isMobile ? 'collection-image-container-mobile' : 'collection-image-container'}>
                <img src={collection?.image} className="collection-image" />
            </div>
        </div>
        <div className='collection-name-row'>
            <div className='row'>
                <div className={isMobile ? 'collection-name-mobile' : 'collection-name'}> {collection?.name}
                    {/* <FontAwesomeIcon icon="fa-solid fa-shield-check" /> */}
                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: "rgb(32, 129, 226)", fontSize: '17px', marginLeft: '5px', verticalAlign: 'super' }} size={'sm'} />
                </div>

            </div>
        </div>
        {collection.description != '' &&
            <div className={isMobile ? 'collection-description-mobile' : 'collection-description'}>
                {collection.description}
            </div>}

        <div className='row col-12 nft-collection-page' >

            <div className='col-sm-12 '>
                <div className='row col-sm-12'>
                    {/* <div className='col-sm-2'>

                    </div> */}
                    <div className='col-sm-12'>
                        <div className='col-sm-12 row  d-flex justify-content-end'>
                            <div className='col-sm-2 d-flex justify-content-center align-items-center align-content-center'>
                                {loading && <Spin />}
                            </div>

                            <div className='col-sm-3'>
                                <Search search={search} setSearch={setSearch} />
                            </div>

                            <div className='col-sm-4 select-filter-outline'>

                                <Select
                                    defaultValue={filter}
                                    className='w-100'
                                    onChange={handleChange}
                                    value={filter}
                                >
                                    <Option value="pricehl">Price High To Low</Option>

                                    <Option value="pricelh">Price Low To High</Option>


                                </Select>
                            </div>



                        </div>


                        <div className='row p-3 collection'>
                            {!loading && data.map((nft, index) => {
                                let item = getMarketItem(nft);
                                return <div className='col-sm-3'
                                    onClick={() => {
                                        dispatch(setActiveNft(nft));
                                        dispatch(setActionMenu({
                                            nft,
                                            action: 'info'
                                        }))
                                    }}
                                    index={index}
                                >
                                    <LazyLoad offset={100} className='nft-body' >
                                        <div className='nft-body'>

                                            <img
                                                src={nft.image || "error"}
                                                fallback={fallbackImg}
                                                className="nft-image"
                                                alt={nft.name}
                                                onFocus={() => console.log('image focused')}
                                            />



                                            <div className='row d-flex flex-row collection-nft-description '>
                                                <span className='col-sm-6' >{nft.name} - {`#${nft.token_id}`} </span>


                                                {nft.listed && <span className='col-sm-6'> <AvaxLogo /> {Moralis.Units.FromWei(nft.price)}</span>}
                                            </div>


                                        </div>
                                    </LazyLoad>

                                </div>

                            })}
                            <div className='loadmore d-flex justify-content-center align-items-center align-content-center'>

                                {loadmoreloading && <Spin />}

                                {!loadmoreloading && <div onClick={() => {
                                    setloadmoreloading(true);
                                    setsortChanged(false);
                                    setlimit(limit + 50)
                                }} className="load-more">  Load More</div>}


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