import React, { useState } from 'react';
import { InputNumber, Slider, Checkbox, Divider, Typography } from 'antd';

const { Title } = Typography;

const allFilterOptions = [
  { label: 'Breakfast included', value: 'breakfastIncluded' },
  { label: 'Lunch included', value: 'lunchIncluded' },
  { label: 'Dinner included', value: 'dinnerIncluded' },
  { label: 'Car park', value: 'carPark' },
  { label: 'Free WiFi', value: 'freeWifi' },
  { label: 'Premium WiFi', value: 'premiumWifi' },
  { label: 'Fitness Center Access', value: 'fitnessCenter' },
  { label: 'Welcome Drink', value: 'welcomeDrink' },
  { label: 'Pool Access', value: 'poolAccess' },
  { label: 'Beverages', value: 'beverages' },
];

const generateFacilityObject = (filters) => ({
  breakfast: filters.includes('breakfastIncluded') ? 1 : 0,
  lunch_included: filters.includes('lunchIncluded') ? 1 : 0,
  dinner_included: filters.includes('dinnerIncluded') ? 1 : 0,
  parking: filters.includes('carPark') ? 1 : 0,
  free_wifi: filters.includes('freeWifi') ? 1 : 0,
  premium_wifi: filters.includes('premiumWifi') ? 1 : 0,
  fitness_center_access: filters.includes('fitnessCenter') ? 1 : 0,
  welcome_drink: filters.includes('welcomeDrink') ? 1 : 0,
  pool_access: filters.includes('poolAccess') ? 1 : 0,
  beverages: filters.includes('beverages') ? 1 : 0,
  additional_info: '',
  image_path: ''
});

const HotelFilterSidebar = ({ onChange }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(120000);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const updateChange = (filters = selectedFilters, min = minPrice, max = maxPrice) => {
    onChange?.({
      facility: generateFacilityObject(filters),
      minPrice: min,
      maxPrice: max
    });
  };

  const budgetChange = ([min, max]) => {
    setMinPrice(min);
    setMaxPrice(max);
    updateChange(selectedFilters, min, max);
  };

  const handleCheckboxChange = (filters) => {
    setSelectedFilters(filters);
    updateChange(filters);
  };

  return (
    <div className="p-4 w-full bg-white rounded shadow">
      {/* Budget Section */}
      <Title level={5}>Your budget (per night)</Title>
      <Slider
        range
        min={0}
        max={120000}
        step={100}
        defaultValue={[minPrice, maxPrice]}
        // value={[minPrice, maxPrice]}
        // onChange={budgetChange}
        onAfterChange={budgetChange}
      />
      <div className="flex justify-between gap-2">
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

      {/* Your filters - selected only */}
      <Title level={5} style={{ marginTop: 20 }}>Your filters</Title>
      <Checkbox.Group
        className="flex flex-col gap-2"
        onChange={handleCheckboxChange}
        value={selectedFilters}
      >
        {allFilterOptions
          .filter((f) => selectedFilters.includes(f.value))
          .map((filter) => (
            <Checkbox key={filter.value} value={filter.value}>
              {filter.label}
            </Checkbox>
          ))}
      </Checkbox.Group>

      <Divider />

      {/* All available filters */}
      <Title level={5}>All filters</Title>
      <Checkbox.Group
        className="flex flex-col gap-2"
        onChange={handleCheckboxChange}
        value={selectedFilters}
      >
        {allFilterOptions.map((filter) => (
          <Checkbox key={filter.value} value={filter.value}>
            {filter.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );
};

export default HotelFilterSidebar;
