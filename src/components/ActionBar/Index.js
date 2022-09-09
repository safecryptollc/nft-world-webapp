import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from 'redux/actions/menuActions';
import './action.css'
import BuyNft from './BuyNFT/Index';
import NFT from './NFT/Index';
const ActionBar = () => {

    const dispatch = useDispatch();
    const { action } = useSelector(state => state.actionMenu);
    const { isMobile } = useSelector(state => state.nft);

    return <div className={isMobile ? 'action-menu-mobile' : 'action-menu'}>
        {action == 'info' && <NFT />}
    </div>
}

export default ActionBar;