import { ContactsOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useLowestPrice = (addr) => {
    const { token } = useMoralisWeb3Api();
    const { chainId } = useMoralisDapp();
    const { resolveLink } = useIPFS();
    const { price, setPrice } = useState();
    const {
        fetch: getNFTLowestPrice,
        data,
        error,
        isLoading,
    } = useMoralisWeb3ApiCall(token.getNFTLowestPrice, {
        address: "0x7de3085b3190b3a787822ee16f23be010f5f8686",
        days: "3",
    });

    useEffect(async () => {
        console.log(data);
        console.log(error);
        if (data?.result) {
            console.log(data);
        }
    }, [data, error, isLoading]);

    return {
        price
    };
};
