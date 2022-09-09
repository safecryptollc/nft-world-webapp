import { useEffect, useState, useContext } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import Account from "components/Account";
import Chains from "components/Chains";
import NFTBalance from "components/NFTBalance";
import NFTTokenIds from "components/NFTTokenIds";
import { Menu, Layout } from "antd";
import SearchCollections from "components/SearchCollections";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";
import NFTMarketTransactions from "components/NFTMarketTransactions";

import { DarkModeContext } from "./providers/DarkModeProvider";

import logo from "./assets/images/new-logo.png";
import selfCollect from "./assets/images/self-collect.png";
import transaction from "./assets/images/transaction.png";
import market from "./assets/images/MARKET.png";
import nftImage from "./assets/images/nft.png";

import ThemeSwitch from "./components/ThemeSwitch";
import "bootstrap/dist/css/bootstrap.min.css";

import NFT from "components/NFT/Index";
import ActionBar from "components/ActionBar/Index";

// import MyCollection from "components/MyCollection/Index";
import { useDispatch, useSelector } from "react-redux";
import Collection from "components/Collection/Index";
import FromApp from "components/FromApp";
import {
  resetNftData,
  setCollection,
  toggleIsmobile,
} from "redux/actions/nftActions";

const { Header, Footer } = Layout;

const styles = {
  content: {
    // display: "flex",
    // justifyContent: "center",
    // fontFamily: "Roboto, sans-serif",
    color: "#041836",
    // marginTop: "130px",
    // padding: "10px",
    // backgroundColor: "yellow",
    padding: "0px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    backgroundColor: "rgb(32, 34, 37)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerDark: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#000",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "rgb(32, 34, 37)",
    color: "white",
  },
};
const App = ({ isServerInfo }) => {
  const {
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    isWeb3EnableLoading,
    authenticate,
  } = useMoralis();

  const [inputValue, setInputValue] = useState("explore");
  const { isMobile } = useSelector((state) => state.nft);

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  useEffect(() => {
    if (isMobile && !isAuthenticated)
      authenticate({
        signingMessage: "Welcome to NFT World Marketplace ",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isMobile]);

  const dispatch = useDispatch();
  const { darkMode } = useContext(DarkModeContext);

  const { menuStatus } = useSelector((state) => state.actionMenu);

  // const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    handleWindowResize();
    function handleWindowResize() {
      const { innerWidth } = getWindowSize();
      if (innerWidth < 430) {
        dispatch(toggleIsmobile(true));
      } else {
        dispatch(toggleIsmobile(false));
      }
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  return [
    <Layout
      style={{
        height: "100vh",
        overflow: "auto",
        backgroundColor: "#191e2b",
        color: "#fff",
      }}
      className={menuStatus && "blur"}
    >
      <script
        src="https://unpkg.com/react/umd/react.production.min.js"
        crossorigin
      ></script>

      <script
        src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
        crossorigin
      ></script>

      <script
        src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
        crossorigin
      ></script>
      <Router>
        <Header style={darkMode ? styles.headerDark : styles.header}>
          <Logo />
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              fontSize: "17px",
              fontWeight: "500",
              marginLeft: "50px",
              width: "100%",
              background: "rgb(32,34,37)",
              color: "#fff",
            }}
            defaultSelectedKeys={["market"]}
          >
            <Menu.Item key="market">
              <NavLink
                to="/market"
                onClick={() => {
                  dispatch(setCollection(null));
                  dispatch(resetNftData([]));
                }}
              >
                <div className="header-link">
                  <img src={market} /> Maket
                </div>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="nftcollecion">
              <NavLink to="/nftcollecion">
                <div className="header-link">
                  <img src={nftImage} /> NFT's
                </div>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="mycollection">
              <NavLink to="/mycollection">
                <div className="header-link">
                  <img src={selfCollect} />
                  My Collection
                </div>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="transactions">
              <NavLink to="/transactions">
                <div className="header-link">
                  <img src={transaction} />
                  Transactions
                </div>
              </NavLink>
            </Menu.Item>

            {/* <Menu.Item key="themeswitch">
              <ThemeSwitch />
            </Menu.Item> */}
          </Menu>
          <div style={styles.headerRight}>
            {!isMobile && (
              <>
                <SearchCollections setInputValue={setInputValue} />
                <Chains />
                <NativeBalance />
              </>
            )}
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Routes style={{ padding: 0, margin: 0 }} def>
            <Route path="/" element={<Navigate to="/market" />} />

            <Route path="/mycollection" element={<NFTBalance />} />

            <Route
              path="/market"
              element={
                <NFTTokenIds
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              }
            />

            <Route
              path="/nftcollecion"
              element={
                <NFT inputValue={inputValue} setInputValue={setInputValue} />
              }
            />

            <Route path="/transactions" element={<NFTMarketTransactions />} />
            <Route
              path="/from-app/:collectionId/:tokenId"
              element={<FromApp />}
            />

            <Route path="*" element={<Navigate to="/market" />} />
          </Routes>
        </div>
      </Router>

      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#191e2b",
          color: "#fff",
        }}
      ></Footer>
    </Layout>,
    menuStatus && <ActionBar />,
  ];
};

export const Logo = () => (
  <a href="/market">
    {" "}
    <img
      src={logo}
      style={{
        width: 130,
        height: 60,
        backgroundColor: "rgb(32, 34, 37)",
      }}
    />
  </a>
);

export default App;
