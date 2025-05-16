/**
 * @author Rohit Kumar
 */

import {
  Button, Checkbox, Col, Form, Input, InputNumber, Modal, Result, Row, Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useFetchData from '../../hooks/useFetchData';
import { reFetchData } from '../../store/slice/appSlice';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import PageLoader from '../shared/PageLoader';
import ImageUploadMultipart from '../shared/ImageUploadMultipart';

function RoomEdit({ roomEditModal, setRoomEditModal }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const availOptions = [
    { "label": 'Booked', "value": 0 },
    { label: 'Available', value: 1 },
    { label: 'Unavailable', value: 2 }
  ]
  const [form] = Form.useForm();
  const params = {
    "action": "GET",
    "room_id": roomEditModal?.room_id,
    hotel_id: roomEditModal?.hotel_id,
    room_name: 'any',
    room_slug: 'any',
    room_type: '0',
    room_price: '0',
    room_size: '0',
    room_capacity: '0',
    room_description: 'any',
    allow_pets: '0',
    provide_breakfast: '0',
    featured_room: '0'
  }


  // fetch room-details API data
  const [fetchLoading, fetchError, fetchResponse] = useFetchData('/hotelroom', false, params);



  // set form data from API data
  useEffect(() => {
    if (fetchResponse) {
      form.setFieldsValue({
        room_name: fetchResponse?.room_name || undefined,
        room_slug: fetchResponse?.room_slug || undefined,
        room_type: fetchResponse?.room_type || undefined,
        room_price: fetchResponse?.room_price || undefined,
        room_size: fetchResponse?.room_size || undefined,
        room_capacity: fetchResponse?.room_capacity || undefined,
        allow_pets: fetchResponse?.allow_pets,
        provide_breakfast: fetchResponse?.provide_breakfast,
        featured_room: fetchResponse?.featured_room,
        room_description: fetchResponse?.room_description || undefined,
        extra_facilities: fetchResponse?.extra_facilities || undefined,
        is_available: fetchResponse?.is_available || undefined,
        room_images: fetchResponse?.room_images || undefined
      });
    }
  }, [fetchResponse, form]);

  const normFile = (e) => {
    if (Array.isArray(e)) { return e; }
    return e?.fileList;
  };

  // function to handle create new room
  const onFinish = async (values) => {
    console.log('Form values:', values);

    try {
      const formData = new FormData();

      // Append all basic fields
      formData.append('action', 'UPDATE');
      formData.append('room_name', values.room_name);
      formData.append('room_slug', values.room_slug);
      formData.append('room_type', values.room_type);
      formData.append('room_price', values.room_price);
      formData.append('room_size', values.room_size);
      formData.append('room_capacity', values.room_capacity);
      formData.append('allow_pets', values?.allow_pets ? 1 : 0);
      formData.append('provide_breakfast', values?.provide_breakfast ? 1 : 0);
      formData.append('featured_room', values?.featured_room ? 1 : 0);
      formData.append('room_description', values.room_description || '');
      formData.append('room_id', roomEditModal?.room_id || '');
      formData.append('is_available', values?.is_available);

      // Append facilities if they exist
      if (values.extra_facilities) {
        values.extra_facilities.forEach((facility, index) => {
          formData.append(`extra_facilities[${index}]`, facility);
        });
      }

      // Handle image uploads properly
      if (values.room_images && values.room_images.length > 0) {
        values.room_images.forEach((image, index) => {
          // Check if image is a File object (new upload) or existing path (string)

          formData.append(`room_images`, image); // Append the actual file
          if (image instanceof File) {
            console.log(image);
          } else if (typeof image === 'string') {
            // If it's a string, it might be an existing image path
            formData.append(`room_images`, image);
          }
        });
      }

      setLoading(true);


      const response = await ApiService.post('/hotelroom', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);

      if (response?.success) {
        notificationWithIcon('success', 'SUCCESS', response?.message || 'Room updated successfully');
        form.resetFields();
        dispatch(reFetchData());
        setRoomEditModal(prev => ({ ...prev, open: false }));
      } else {
        notificationWithIcon('error', 'ERROR', response?.data?.message || 'Room update failed');
      }
    } catch (err) {
      setLoading(false);
      console.error('Error updating room:', err);

      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Sorry! Something went wrong. Please try again.';

      notificationWithIcon('error', 'ERROR', errorMessage);
    }
  };

  return (
    <Modal
      title='Edit Room Information'
      open={roomEditModal.open}
      onOk={() => setRoomEditModal(
        (prevState) => ({ ...prevState, open: false })
      )}
      onCancel={() => setRoomEditModal(
        (prevState) => ({ ...prevState, open: false })
      )}
      footer={[]}
      width={1200}
      centered
    >
      {fetchLoading ? (<PageLoader />) : fetchError ? (
        <Result
          title='Failed to fetch'
          subTitle={fetchError}
          status='error'
        />
      ) : (
        <Form
          form={form}
          className='login-form'
          name='room-edit-form'
          onFinish={onFinish}
          layout='vertical'
        >
          <div className='two-grid-column'>
            <Form.Item
              className='w-full md:w-1/2'
              label='Room Name'
              name='room_name'
              rules={[{
                required: true,
                message: 'Please input your Room Name!'
              }]}
            >
              <Input
                placeholder='Room Name'
                size='large'
                type='text'
                allowClear
              />
            </Form.Item>

            <Form.Item
              className='w-full md:w-1/2'
              label='Room Slug'
              name='room_slug'
              rules={[{
                required: true,
                message: 'Please input your Room Slug!'
              }]}
            >
              <Input
                placeholder='Room Slug'
                size='large'
                type='text'
                allowClear
              />
            </Form.Item>
          </div>

          <div className='two-grid-column'>
            <Form.Item
              className='w-full md:w-1/2'
              label='Room Type'
              name='room_type'
              rules={[{
                required: true,
                message: 'Please input your Room Type!'
              }]}
            >
              <Select
                placeholder='-- select room type --'
                optionFilterProp='children'
                options={[
                  { value: 'single', label: 'Single' },
                  { value: 'couple', label: 'Couple' },
                  { value: 'presidential', label: 'Presidential' }
                ]}
                size='large'
                allowClear
              />
            </Form.Item>

            <Form.Item
              className='w-full md:w-1/2'
              label='Room Price'
              name='room_price'
              rules={[{
                required: true,
                message: 'Please input your Room Price!'
              }]}
            >
              <InputNumber
                className='w-full'
                placeholder='Room Price'
                type='number'
                size='large'
                min={1}
                max={100000}
              />
            </Form.Item>
          </div>

          
          <Row gutter={8}>
            <Col span={16}>
            <div className='two-grid-column'>
              <Form.Item
                className='w-full md:w-1/2'
                label='Room Size'
                name='room_size'
                rules={[{
                  required: true,
                  message: 'Please input your Room Size!'
                }]}
              >
                <InputNumber style={{width:'100%'}}
                  className='w-full'
                  placeholder='Room Size'
                  type='number'
                  size='large'
                  min={1}
                  max={1000}
                />
              </Form.Item>
               <Form.Item
                className='w-full md:w-1/2'
                label='Room Capacity'
                name='room_capacity'
                rules={[{
                  required: true,
                  message: 'Please input your Room Capacity!'
                }]}
              >
                <InputNumber
                  className='w-full'
                  placeholder='Room Capacity'
                  type='number'
                  size='large'
                  min={1}
                  max={10}
                />
              </Form.Item>
              
            </div>

              </Col>
            <Col  span={8}>
            <Form.Item
                label='Availability'
                name='is_available'
                // initialValue={'Soft, oversized bath towels'}
                rules={[{
                  required: true,
                  message: 'Please Select Availability'
                }]}
              >
                <Select
                  placeholder='-- select Availability --'
                  optionFilterProp='children'
                  options={availOptions}
                  size='large'
                  allowClear
                />
              </Form.Item>

            </Col>
          </Row>

          <Form.Item
            label='Room Description'
            name='room_description'
            rules={[{
              required: true,
              message: 'Please input your Room Description!'
            }]}
          >
            <Input.TextArea
              placeholder='Type here Room Description'
              rows={4}
            />
          </Form.Item>


          {/* <Form.Item
            label='Extra Facilities'
            name='extra_facilities'
            // initialValue={'Soft, oversized bath towels'}
            rules={[{
              required: true,
              message: 'Please input your Extra Facilities!'
            }]}
          >
            <Select
              placeholder='-- select room extra facilities --'
              optionFilterProp='children'
              options={EF}
              mode='multiple'
              size='large'
              allowClear
            />
          </Form.Item> */}

          <Form.Item
            name="room_images"
            label="Room Images"
            valuePropName="value"
            getValueFromEvent={normFile}
            rules={[
              {
                required: false,
                // validator: (_, value) =>
                //   value?.length > 0
                //     ? Promise.resolve()
                //     : Promise.reject('Please upload at least one image!')
              }
            ]}
          >
            <ImageUploadMultipart />
          </Form.Item>
          <div className='flex flex-col items-start justify-start gap-y-2'>
            <Form.Item name='allow_pets' valuePropName='checked' noStyle>
              <Checkbox className='ml-2.5'>Allow pets?</Checkbox>
            </Form.Item>
            <Form.Item name='provide_breakfast' valuePropName='checked' noStyle>
              <Checkbox>Provide Breakfast?</Checkbox>
            </Form.Item>
            <Form.Item name='featured_room' valuePropName='checked' noStyle>
              <Checkbox>Featured Room?</Checkbox>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              className='login-form-button mt-4'
              htmlType='submit'
              type='primary'
              size='large'
              loading={loading}
              disabled={loading}
            >
              Update Room Info
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default React.memo(RoomEdit);
