/**
 * @author Rohit Kumar
 */

import {
  Button,
  Descriptions, Image, List, Result, Row, Skeleton, Tag, Typography
} from 'antd';
import React, { useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import { roomStatusAsResponse, roomTypeAsColor } from '../../utils/responseAsStatus';
import { useNavigate } from 'react-router-dom';

function RoomDetails({ id, hotel_id }) {
  
  const navigate=useNavigate();
  
 
   const [query, setQuery] = useState({
    action: 'GET',
    room_id: id,
    hotel_id: hotel_id,
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
  })
  
  const [loading, error, response] = useFetchData(`/hotelroom`, false,query);
  

  return (
    <Skeleton loading={loading} paragraph={{ rows: 10 }} active avatar>
      {error ? (
        <Result
          title='Failed to fetch'
          subTitle={error}
          status='error'
        />
      ) : (
        <Descriptions
          title='Room Information'
          bordered
        >
          <Descriptions.Item label='Images' span={3}>
            <Image.PreviewGroup>
              {response?.images?.map((image) => (
                <Image
                  key={uniqueId()}
                  className='p-2'
                  src={`http://localhost:5000/${image}`}
                  crossOrigin='anonymous'
                  alt='user-image'
                  width={120}
                  height={100}
                />
              ))}
            </Image.PreviewGroup>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Name</span>}
          >
            {response?.data?.room_name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Slug</span>}
            span={2}
          >
            {response?.data?.room_slug}
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Descriptions</span>}
          >
            <Tag
              className='text-center uppercase'
              color={roomTypeAsColor(response?.room_type)}
            >
              {response?.room_type}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Price</span>}
            span={2}
          >
            {`$ ${response?.room_price}`}
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Size</span>}
          >
            {`${response?.room_size} sq. ft.`}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Capacity</span>}
            span={2}
          >
            {`${response?.room_capacity} Person`}
          </Descriptions.Item>

          <Descriptions.Item label={<span className='whitespace-nowrap'>Allow Pets</span>}>
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.data?.allow_pets ? 'success' : 'error'}
            >
              {response?.data?.allow_pets ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Provided Breakfast</span>}
            span={2}
          >
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.provide_breakfast ? 'success' : 'error'}
            >
              {response?.provide_breakfast ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Featured Room</span>}
          >
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.featured_room ? 'success' : 'error'}
            >
              {response?.featured_room ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Status</span>}
            span={2}
          >
            <Tag
              className='w-[80px] text-center uppercase'
              color={roomStatusAsResponse(response?.room_status).color}
            >
              {roomStatusAsResponse(response?.room_status).level}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Last Update At</span>}
          >
            {response?.updated_at?.split('T')[0]}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Created At</span>}
            span={2}
          >
            {response?.created_at?.split('T')[0]}
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Room Descriptions</span>}
            span={3}
          >
            {response?.room_description}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Extra Facilities</span>}
            span={3}
          >
            <List
              bordered
              dataSource={response?.data?.extra_facilities}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>{item}</Typography.Text>
                </List.Item>
              )}
            />
          </Descriptions.Item>
        </Descriptions>
      )}
     {/* <Row style={{alignItems:'center',}}>
       <Button type="primary" size={20} onClick={()=>navigate('/main/payment')}>
            Book Now
          </Button>
     </Row> */}
    </Skeleton>
  );
}

export default React.memo(RoomDetails);
