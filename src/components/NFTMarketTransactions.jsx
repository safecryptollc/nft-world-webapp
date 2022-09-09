import React, { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";

import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Table, Tag, Space, Modal, Spin } from "antd";
import { AvaxLogo, PolygonCurrency } from "./Chains/Logos";
import { useWeb3ExecuteFunction } from "react-moralis";

import moment from "moment";

import { config } from "../config";

import "./transactions.css";

function NFTMarketTransactions() {
  const { chainId, marketAddress, contractABI } = useMoralisDapp();

  // const { walletAddress } = useMoralisDapp() || "";
  const { Moralis, user } = useMoralis();

  const { walletAddress } = useMoralisDapp();
  console.log(walletAddress);
  const contractProcessor = useWeb3ExecuteFunction();
  const contractABIJson = JSON.parse(contractABI);

  const [loading, setLoading] = useState(false);

  const queryItemImages = useMoralisQuery("ItemImages");
  const fetchItemImages = JSON.parse(
    JSON.stringify(queryItemImages.data, [
      "nftContract",
      "tokenId",
      "name",
      "image",
    ])
  );
  const queryMarketItems = useMoralisQuery(config.moralisTableName);

  const fetchMarketItems = walletAddress
    ? JSON.parse(
        JSON.stringify(queryMarketItems.data, [
          "objectId",
          "updatedAt",
          "price",
          "nftContract",
          "itemId",
          "sold",
          "tokenId",
          "seller",
          "owner",
          "canceled",
        ])
      )
        .filter(
          (item) =>
            item.seller.toLowerCase() === walletAddress.toLowerCase() ||
            item.owner.toLowerCase() === walletAddress.toLowerCase()
        )
        .sort((a, b) =>
          a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0
        )
    : [];

  function getImage(addrs, id) {
    const img = fetchItemImages.find(
      (element) =>
        element.nftContract.toLowerCase() === addrs.toLowerCase() &&
        element.tokenId === id
    );
    return img?.image;
  }

  function getName(addrs, id) {
    const nme = fetchItemImages.find(
      (element) =>
        element.nftContract.toLowerCase() === addrs.toLowerCase() &&
        element.tokenId === id
    );
    return nme?.name;
  }

  const cancelListing = async (params) => {
    setLoading(true);
    const ops = {
      contractAddress: marketAddress,
      functionName: "cancelMarketItem",
      abi: contractABIJson,
      params: {
        nftContract: params.collection,
        itemId: params.itemId,
      },
    };
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        setLoading(false);
        updateListCancelled(params.objectId, walletAddress);
        updateMetaData(params.collection, params.item);
        succCancel();
      },
      onError: (error) => {
        console.log(error);
        setLoading(false);
        failCancel();
      },
    });
  };

  function failCancel() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with Cancelling`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }
  function succCancel() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Cancellation is successfull`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Item",
      key: "item",
      render: (text, record) => (
        <Space size="middle">
          <img
            src={getImage(record.collection, record.item)}
            style={{ width: "40px", borderRadius: "4px" }}
          />
          <span>#{record.item}</span>
        </Space>
      ),
    },
    {
      title: "Collection",
      key: "collection",
      render: (text, record) => (
        <Space size="middle">
          <span>{getName(record.collection, record.item)}</span>
        </Space>
      ),
    },
    {
      title: "Transaction Status",
      key: "tags",
      dataIndex: "tags",
      render: (tags, record) => {
        if (record.canceled) {
          return (
            <Tag color={"orange"} key={"canceled"}>
              CANCELED
            </Tag>
          );
        }
        return (
          <>
            {tags.map((tag) => {
              let color = "geekblue";
              let status = "BUY";
              if (tag === false) {
                color = "volcano";
                status = "waiting";
              } else if (tag === true) {
                color = "green";
                status = "confirmed";
              }
              if (tag === walletAddress) {
                status = "SELL";
              }

              return (
                <Tag color={color} key={tag}>
                  {status.toUpperCase()}
                </Tag>
              );
            })}
            {record.canceled == false && record.sold == false && (
              <>
                {!loading && (
                  <button
                    class="btn btn-warning btn-sm"
                    style={{ fontSize: "8px" }}
                    onClick={() => cancelListing({ ...record })}
                  >
                    Cancel
                  </button>
                )}
                {loading && <Spin />}
              </>
            )}
          </>
        );
      },
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      render: (e) => (
        <Space size="middle">
          <AvaxLogo />
          <span>{e}</span>
        </Space>
      ),
    },
  ];

  async function updateListCancelled(objectId) {
    const marketList = Moralis.Object.extend(config.moralisTableName);
    const query = new Moralis.Query(marketList);
    await query.get(objectId).then((obj) => {
      obj.set("canceled", true);
      obj.set("owner", walletAddress);
      obj.save();
    });
  }

  const updateMetaData = async (collection, item) => {
    const NFTMetadata = Moralis.Object.extend("nftmetadata");
    const metaquery = new Moralis.Query(NFTMetadata);
    metaquery.equalTo("token_address", collection.toLowerCase());
    metaquery.equalTo("token_id", String(item));
    await metaquery.first().then((obj) => {
      obj.set("listed", false);
      obj.set("owner", walletAddress);
      obj.save();
    });
  };

  const data = fetchMarketItems?.map((item, index) => ({
    key: index,
    objectId: item.objectId,
    date: moment(item.updatedAt).format("DD-MM-YYYY HH:mm"),
    collection: item.nftContract,
    item: item.tokenId,
    itemId: item.itemId,
    canceled: item.canceled,
    tags: [item.seller, item.sold],
    sold: item.sold,
    seller: item.seller,
    price: Moralis.Units.FromWei(item.price),
  }));

  return (
    <>
      <div className="container ">
        <div className="table table-responsive " style={{ height: "100vh" }}>
          <Table columns={columns} dataSource={data} className="mt-5" />
        </div>
      </div>
    </>
  );
}

export default NFTMarketTransactions;
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Item",
    key: "item",
  },
  {
    title: "Collection",
    key: "collection",
  },
  {
    title: "Transaction Status",
    key: "tags",
    dataIndex: "tags",
  },
  {
    title: "Price",
    key: "price",
    dataIndex: "price",
  },
];
