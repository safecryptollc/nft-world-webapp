import { combineReducers } from "redux";

import nftReducer from "./nft";
import actionMenu from "./actionBar";

export default combineReducers({
  nft: nftReducer,
  actionMenu:actionMenu
});