import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from 'react'

// import { Web3Context } from '../providers/Web3Provider'


const ListOnMarket = async ({ nft, price, marketAddress, abi }) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();


    // const { nftContract, marketplaceContract, hasWeb3 } = useContext(Web3Context)


    const provider = new ethers.providers.Web3Provider(connection, "any");
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    // const web = new Web3(provider);
    // console.log(web);
    // console.log(signerAddress);
    // const marketplaceContract = new ethers.Contract(
    //     marketAddress,
    //     abi,
    //     signer
    // );

    // let listingFee = await marketplaceContract.getListingFee();

    // const finalPrice = String(price * ("1e" + 18));


    // const transaction = await marketplaceContract.createMarketItem(nft.token_address, nft.token_id, finalPrice, { value: String(ethers.utils.formatEther(listingFee) * ("1e" + 18)) })
    // await transaction.wait()




    // const listing = await marketplaceContract.createMarketItem(nft.token_address, nft.token_id, finalPrice, { value: String(ethers.utils.formatEther(listingFee) * ("1e" + 18)) })
    //     .then((data) => console.log(data))
    //     .catch((error) => console.log(error));



}

export default ListOnMarket
