import React, { useState } from 'react';
import { Input, Slider, InputNumber, Checkbox, Divider, Typography } from 'antd';

const { Search } = Input;
const { Title } = Typography;

const HotelFilterSidebar = ({ onChange }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(120000);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const budgetChange = (value) => {
    const [min, max] = value;
    setMinPrice(min);
    setMaxPrice(max);
    onChange?.({ minPrice: min, maxPrice: max, filters: selectedFilters });
  };

  const handleCheckboxChange = (checkedValues) => {
    setSelectedFilters(checkedValues);
    onChange?.({ minPrice, maxPrice, filters: checkedValues });
  };

  return (
    <div className="p-4 w-full bg-white rounded shadow">
      {/* Search */}
      {/* <Search
        placeholder="Text search"
        allowClear
        style={{ marginBottom: 20 }}
        onSearch={(val) => onChange?.({ search: val, minPrice, maxPrice, filters: selectedFilters })}
      /> */}

      {/* Budget slider */}
      <Title level={5}>Your budget (per night)</Title>
      <Slider
        range
        min={0}
        max={120000}
        step={100}
        value={[minPrice, maxPrice]}
        onChange={budgetChange}
      />
      <div className="flex justify-between">
        <InputNumber
          prefix="Rs."
          min={0}
          max={maxPrice}
          value={minPrice}
          onChange={(val) => budgetChange([val || 0, maxPrice])}
        />
        <InputNumber
          prefix="Rs."
          min={minPrice}
          max={120000}
          value={maxPrice}
          onChange={(val) => budgetChange([minPrice, val || 120000])}
        />
      </div>

      <Divider />

      {/* Your filters */}
      <Title level={5} style={{ marginTop: 20 }}>Your filters</Title>
      <Checkbox.Group
        className="flex flex-col gap-2"
        onChange={handleCheckboxChange}
        value={selectedFilters}
      >
        <Checkbox value="earlyCheckIn">Early check-in</Checkbox>
        <Checkbox value="hotel">Hotel</Checkbox>
        <Checkbox value="exceptionalLocation">Location: 9+ Exceptional</Checkbox>
        <Checkbox value="carPark">Car park</Checkbox>
      </Checkbox.Group>

      <Divider />

      {/* Popular filters */}
      <Title level={5}>All filters</Title>
      <Checkbox.Group
        className="flex flex-col gap-2"
        onChange={handleCheckboxChange}
        value={selectedFilters}
      >
        <Checkbox value="breakfastIncluded">Breakfast included</Checkbox>
        <Checkbox value="payNow">Pay now</Checkbox>
        <Checkbox value="freeCancellation">Free cancellation</Checkbox>
        <Checkbox value="coffeeTea">Coffee/tea maker</Checkbox>
      </Checkbox.Group>
    </div>
  );
};

export default HotelFilterSidebar;
