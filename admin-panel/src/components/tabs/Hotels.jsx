import React, { useState, useEffect } from 'react';
import { AppstoreAddOutlined } from '@ant-design/icons';
import {
  Button, Tabs, Modal, Form, Input, Checkbox, message
} from 'antd';
import ApiService from '../../utils/apiService';
import HotelList from './Hotel/HotelList';
import ImageUpload from '../shared/ImageUpload';
import HotelFilterSidebar from '../dashboard/HotelFilterSidebar';

function Hotels() {
  const [activeKey, setActiveKey] = useState('1');
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchHotels = async () => {
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
        star_rating: 0
      };
      const response = await ApiService.post('/hotel', params);
      setHotels(response.data ?? []);
    } catch (error) {
      message.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const addHotel = async (hotel) => {
    try {
      const params = {
        action: 'ADD',
        hotel_id: 0,
        ...hotel
      };
      console.log(params);
      await ApiService.post('/hotel', params);
      await fetchHotels();
      message.success('Hotel added successfully');
    } catch (error) {
      message.error('Failed to add hotel');
      console.error(error);
    }
  };

  const updateHotel = async (hotelId, updatedValues) => {
    try {
      const params = {
        action: 'UPDATE',
        hotel_id: hotelId,
        ...updatedValues
      };
      await ApiService.post('/hotel', params);
      await fetchHotels();
      message.success('Hotel updated successfully');
    } catch (error) {
      message.error('Failed to update hotel');
      console.error(error);
    }
  };

  const deleteHotel = async (hotel) => {
    try {
      const params = {
        action: 'DELETE',
        hotel_id: hotel.hotel_id
      };
      await ApiService.post('/hotel', params);
      setHotels(hotels.filter((h) => h.hotel_id !== hotel.hotel_id));
      message.success('Hotel deleted successfully');
    } catch (error) {
      message.error('Failed to delete hotel');
      console.error(error);
    }
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
    console.log(values?.image_base64, facilities);
    const finalPayload = {
      ...values,
      facilitiesJson: JSON.stringify(facilities),
      image_base64: ''
    };

    if (isEdit && currentHotel) {
      updateHotel(currentHotel.hotel_id, finalPayload);
    } else {
      addHotel(finalPayload);
    }
    setShowModal(false);
    setIsEdit(false);
    setCurrentHotel(null);
    form.resetFields();
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
              setShowModal(true);
              setIsEdit(false);
              setCurrentHotel(null);
              form.resetFields();
            }}
          >
            Create Hotel
          </Button>
        )}
        type='editable-card'
        size='large'
      >
        <Tabs.TabPane key="1" tab="Hotels List">
          <div className="flex gap-4">
            {/* Sidebar on the left */}
            <div className="w-72 shrink-0">
              <HotelFilterSidebar
                onChange={(filters) => {
                  // handle filter logic or pass to parent
                  console.log('Filters changed:', filters);
                }}
              />
            </div>

            {/* Hotel list on the right */}
            <div className="flex-1">
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
            label="Facility Image"
            name='image_base64'
            valuePropName="value"
          >
            <ImageUpload />
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
