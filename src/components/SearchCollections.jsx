import { useContext } from "react";

import { Select } from "antd";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getCollectionsByChain } from "helpers/collections";
import { DarkModeContext } from "../providers/DarkModeProvider";

function SearchCollections({ setInputValue }) {
  const { Option } = Select;
  const { chainId } = useMoralisDapp();
  const NFTCollections = getCollectionsByChain(chainId);

  const { darkMode } = useContext(DarkModeContext);

  function onChange(value) {
    setInputValue(value);
  }
  const styles = {
    search: {
      width: "250px",
      marginLeft: "20px",
    },
    searchDark: {
      width: "1000px",
      marginLeft: "20px",
      backgroundColor: "#fff",
    },
  };

  return (
    <>
      <Select
        showSearch
        style={darkMode ? styles.searchDark : styles.search}
        placeholder="Search"
        optionFilterProp="children"
        onChange={onChange}
      >
        {NFTCollections &&
          NFTCollections.map((collection, i) => (
            <Option value={collection.addrs} key={i}>
              {collection.name}
            </Option>
          ))}
      </Select>
    </>
  );
}
export default SearchCollections;
