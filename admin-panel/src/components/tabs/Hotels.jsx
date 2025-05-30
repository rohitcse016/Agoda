import React, { useState, useEffect } from 'react';
import { AppstoreAddOutlined } from '@ant-design/icons';
import {
  Button, Tabs, Modal, Form, Input, Checkbox, message
} from 'antd';
import ApiService from '../../utils/apiService';
import HotelList from './Hotel/HotelList';
import HotelFilterSidebar from '../dashboard/HotelFilterSidebar';
import ImageUploadMultipart from '../shared/ImageUploadMultipart';

function Hotels() {
  const [activeKey, setActiveKey] = useState('1');
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const filters = [];
    const facility = {
      facility: {
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
        image_path: '',
      },
      minPrice: 0,
      maxPrice: 999999,
    }

  const fetchHotels = async (param = facility) => {
    console.log(param);
    try {
      setLoading(true);
      const params = {
        action: 'GET',
        hotel_id: 0,
        name: '',
        description: 'any',
        city: 'any',
        state: 'any',
        country: 'any',
        address: 'any',
        star_rating: 0,
        facilitiesJson: JSON.stringify({ ...param?.facility, minPrice: param?.minPrice, maxPrice: param?.maxPrice }),
      };
      console.log(params);


      const response = await ApiService.post('/hotel', params);
      setHotels(response.data ?? []);
    } catch (error) {
      message.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(facility);
  }, []);

  const addHotel = async (hotel) => {
    try {
      const values = {
        action: 'ADD',
        hotel_id: 0,
        ...hotel
      };
      const formData = new FormData();

      // Basic Hotel Info
      formData.append('action', 'ADD'); // or 'ADD'
      formData.append('hotel_id', 0); // Use 0 or null for ADD
      formData.append('name', values.name || '');
      formData.append('description', values.description || '');
      formData.append('city', values.city || '');
      formData.append('state', values.state || '');
      formData.append('country', values.country || '');
      formData.append('address', values.address || '');
      formData.append('star_rating', values.star_rating || '0.0');
      formData.append('hotel_price', values.hotel_price || '0.00');

      console.log(values);
      const facilitiesArray = [
        {
          breakfast: values.facility?.breakfast ? 1 : 0,
          lunch_included: values.facility?.lunch_included ? 1 : 0,
          dinner_included: values.facility?.dinner_included ? 1 : 0,
          parking: values.facility?.parking ? 1 : 0,
          free_wifi: values.facility?.free_wifi ? 1 : 0,
          premium_wifi: values.facility?.premium_wifi ? 1 : 0,
          fitness_center_access: values.facility?.fitness_center_access ? 1 : 0,
          welcome_drink: values.facility?.welcome_drink ? 1 : 0,
          pool_access: values.facility?.pool_access ? 1 : 0,
          beverages: values.facility?.beverages ? 1 : 0,
          additional_info: values.facility?.additional_info || '',
          image_path: '' // Optional: can be filled in if each facility has its own image
        }
      ];

      formData.append('facilitiesJson', JSON.stringify(facilitiesArray));

      // Hotel Images JSON (paths/names only, assuming you handle uploads separately)
      // const hotelImagePaths = values.hotel_images?.map(img => `/uploads/hotel_images/${img.name}`) || [];
      // formData.append('ImagePathsJson', JSON.stringify(hotelImagePaths));


      if (values.hotel_images && values.hotel_images.length > 0) {
        values.hotel_images.forEach((image, index) => {
          // Check if image is a File object (new upload) or existing path (string)

          formData.append(`hotel_images`, image); // Append the actual file
          if (image instanceof File) {
            console.log(image);
          } else if (typeof image === 'string') {
            // If it's a string, it might be an existing image path
            formData.append(`existing_images[${index}]`, image);
          }
        });
      }

      await ApiService.post('/hotel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await fetchHotels();
      message.success('Hotel added successfully');
    } catch (error) {
      message.error('Failed to add hotel');
      console.error(error);
    }
  };

  const updateHotel = async (hotelId, values) => {
    try {
      const formData = new FormData();

      // Basic Hotel Info
      formData.append('action', 'UPDATE'); // or 'ADD'
      formData.append('hotel_id', hotelId); // Use 0 or null for ADD
      formData.append('name', values.name || '');
      formData.append('description', values.description || '');
      formData.append('city', values.city || '');
      formData.append('state', values.state || '');
      formData.append('country', values.country || '');
      formData.append('address', values.address || '');
      formData.append('starRating', values.star_rating || '0.0');
      formData.append('hotel_Price', values.hotel_price || '0.00');

      console.log(values);
      const facilitiesArray = [
        {
          breakfast: values.facility?.breakfast ? 1 : 0,
          lunch_included: values.facility?.lunch_included ? 1 : 0,
          dinner_included: values.facility?.dinner_included ? 1 : 0,
          parking: values.facility?.parking ? 1 : 0,
          free_wifi: values.facility?.free_wifi ? 1 : 0,
          premium_wifi: values.facility?.premium_wifi ? 1 : 0,
          fitness_center_access: values.facility?.fitness_center_access ? 1 : 0,
          welcome_drink: values.facility?.welcome_drink ? 1 : 0,
          pool_access: values.facility?.pool_access ? 1 : 0,
          beverages: values.facility?.beverages ? 1 : 0,
          additional_info: values.facility?.additional_info || '',
          image_path: '' // Optional: can be filled in if each facility has its own image
        }
      ];

      formData.append('facilitiesJson', JSON.stringify(facilitiesArray));
      if (values.hotel_images && values.hotel_images.length > 0) {
        values.hotel_images.forEach((image, index) => {
          formData.append(`hotel_images`, image);
          if (image instanceof File) {
            console.log(image);
          } else if (typeof image === 'string') {
            // If it's a string, it might be an existing image path
            formData.append(`existing_images[${index}]`, image);
          }
        });
      }


      await ApiService.post('/hotel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await fetchHotels();
      message.success('Hotel updated successfully');
    } catch (error) {
      message.error('Failed to update hotel');
      console.error(error);
    }
  };

  const deleteHotel = async (hotel) => {
    console.log(hotel);

    try {
      const params = {
        action: 'DELETE',
        hotel_id: hotel.hotel_id,
        name: hotel?.name,
      };
      await ApiService.post('/hotel', params);
      fetchHotels();
      // setHotels(hotels.filter((h) => h.hotel_id !== hotel.hotel_id));
      message.success('Hotel deleted successfully');
    } catch (error) {
      message.error('Failed to delete hotel');
      console.error(error);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) { return e; }
    return e?.fileList;
  };

  const handleFormSubmit = (values) => {
    const facilities = [{
      ...values.facility,
      breakfast: values.facility.breakfast ? 1 : 0,
      lunch_included: values.facility.lunch_included ? 1 : 0,
      dinner_included: values.facility.dinner_included ? 1 : 0,
      pool_access: values.facility.pool_access ? 1 : 0,
      free_wifi: values.facility.free_wifi ? 1 : 0,
      premium_wifi: values.facility.premium_wifi ? 1 : 0,
      parking: values.facility.parking ? 1 : 0,
      fitness_center_access: values.facility.fitness_center_access ? 1 : 0,
      welcome_drink: values.facility.welcome_drink ? 1 : 0,
      beverages: values.facility.beverages ? 1 : 0,
      image_base64: values?.image_base64
    }];
    const finalPayload = {
      ...values,
      facilitiesJson: JSON.stringify(facilities),
      image_base64: ''
    };

    if (isEdit && currentHotel) {
      console.log(currentHotel);

      updateHotel(currentHotel.hotel_id, finalPayload);
    } else {
      addHotel(finalPayload);
    }
    form.resetFields();
    setShowModal(false);
    setIsEdit(false);
    setCurrentHotel(null);
  };
  return (
    <div>
      <Tabs
        onChange={setActiveKey}
        activeKey={activeKey}
        tabBarExtraContent={(
          <Button
            icon={<AppstoreAddOutlined />}
            type='primary'
            size='large'
            onClick={() => {

              form.resetFields();
              setShowModal(true);
              setIsEdit(false);
              setCurrentHotel(null);
            }}
          >
            Create Hotel
          </Button>
        )}
        type='editable-card'
        size='large'
      >
        <Tabs.TabPane key="1" tab="Hotels List">
          {/* Fixed/Sticky Top Search Bar (Optional) */}
          <div className="sticky top-0 z-10 bg-white p-4 border-b">
            {/* You can place a search bar or title here */}
            <h2 className="text-lg font-semibold">Available Hotels</h2>
          </div>

          <div className="flex h-[calc(100vh-150px)] overflow-hidden">
            {/* Sidebar on the left */}
            <div className="w-72 p-4 border-r overflow-y-auto">
              <HotelFilterSidebar
                onChange={(filters) => {
                  const finalPayload = {
                    facilitiesJson: JSON.stringify(filters?.facility)
                  };
                  fetchHotels(filters);
                  console.log('Filters changed:', finalPayload);
                }}
              />
            </div>

            {/* Hotel list on the right */}
            <div className="flex-1 p-4 overflow-y-auto">
              <HotelList
                hotels={hotels}
                editHotel={(hotel) => {
                  setIsEdit(true);
                  setCurrentHotel(hotel);
                  setShowModal(true);
                  form.setFieldsValue({
                    ...hotel,
                    facility: {
                      breakfast: !!hotel.breakfast,
                      lunch_included: !!hotel.lunch_included,
                      dinner_included: !!hotel.dinner_included,
                      parking: !!hotel.parking,
                      free_wifi: !!hotel.free_wifi,
                      premium_wifi: !!hotel.premium_wifi,
                      fitness_center_access: !!hotel.fitness_center_access,
                      welcome_drink: !!hotel.welcome_drink,
                      pool_access: !!hotel.pool_access,
                      beverages: !!hotel.beverages,
                      additional_info: hotel.additional_info || '',
                      image_base64: hotel.image_path || ''
                    }
                  });
                }}
                deleteHotel={deleteHotel}
              />
            </div>
          </div>
        </Tabs.TabPane>


      </Tabs>

      <Modal
        open={showModal}
        title={isEdit ? 'Edit Hotel' : 'Add Hotel'}
        onCancel={() => {
          setShowModal(false);
          setIsEdit(false);
          setCurrentHotel(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout='vertical'
          form={form}
          initialValues={currentHotel || {}}
          onFinish={handleFormSubmit}
        >
          <Form.Item
            label='Hotel Name'
            name='name'
            rules={[{ required: true, message: 'Hotel name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label='City' name='city'>
            <Input />
          </Form.Item>
          <Form.Item label='State' name='state'>
            <Input />
          </Form.Item>
          <Form.Item label='Country' name='country'>
            <Input />
          </Form.Item>
          <Form.Item label='Address' name='address'>
            <Input />
          </Form.Item>
          <Form.Item label='Star Rating' name='star_rating'>
            <Input max={5} type='number' />
          </Form.Item>
          <Form.Item label='Booking Price' name='hotel_price'>
            <Input type='number' />
          </Form.Item>

          <h3>Facilities</h3>
          <Form.Item name={['facility', 'breakfast']} valuePropName="checked">
            <Checkbox>Breakfast</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'lunch_included']} valuePropName="checked">
            <Checkbox>Lunch Included</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'dinner_included']} valuePropName="checked">
            <Checkbox>Dinner Included</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'parking']} valuePropName="checked">
            <Checkbox>Parking</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'free_wifi']} valuePropName="checked">
            <Checkbox>Free Wifi</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'premium_wifi']} valuePropName="checked">
            <Checkbox>Premium Wifi</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'fitness_center_access']} valuePropName="checked">
            <Checkbox>Fitness Center Access</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'welcome_drink']} valuePropName="checked">
            <Checkbox>Welcome Drink</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'pool_access']} valuePropName="checked">
            <Checkbox>Pool Access</Checkbox>
          </Form.Item>
          <Form.Item name={['facility', 'beverages']} valuePropName="checked">
            <Checkbox>Beverages</Checkbox>
          </Form.Item>
          <Form.Item label="Additional Info" name={['facility', 'additional_info']}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Hotel Images"
            name='hotel_images'
            valuePropName="value"
            getValueFromEvent={normFile}
            // rules={[
            //   {
            //     required: false,
            //     validator: (_, value) =>
            //       value?.length > 0
            //         ? Promise.resolve()
            //         : Promise.reject('Please upload at least one image!')
            //   }
            // ]}
          >
            <ImageUploadMultipart />
          </Form.Item>
          <Button type="primary" loading={loading} htmlType='submit'>
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default React.memo(Hotels);
