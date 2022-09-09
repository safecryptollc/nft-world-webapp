import React from 'react';
import './search.css'
import { SearchOutlined } from '@ant-design/icons';

const Search = ({ search, setSearch }) => {
    return (
        <div className='search-outline'>
            <SearchOutlined className='icon center' />
            <input type="text" className="text-input" onChange={(e) => setSearch(e.target.value)} value={search} />
        </div>
    );
};

export default Search;