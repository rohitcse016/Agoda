import React from 'react';
import {
  List, Card, Avatar, Button, Space, Rate, Tag, Tooltip
} from 'antd';
import {
  EditOutlined, DeleteOutlined, EnvironmentOutlined, StarFilled
} from '@ant-design/icons';

function HotelList({ hotels, editHotel, deleteHotel }) {
  return (
    <List
      grid={{ gutter: 16, column: 2 }}
      dataSource={hotels}
      renderItem={(hotel) => (
        <List.Item>
          <Card
            hoverable
            style={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            title={(
              <Space>
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {hotel.name?.charAt(0).toUpperCase()}
                </Avatar>
                {console.log(hotel?.image_path)}
                <span>{hotel.name}</span>
              </Space>
            )}
            cover={<img
                alt={`Image of ${hotel.name}`}
                src={`http://localhost:5000${hotel?.image_path}`}
                />}
            actions={[
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => editHotel(hotel)}
                />
              </Tooltip>,
              <Tooltip title="Delete">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => deleteHotel(hotel)}
                />
              </Tooltip>
            ]}
          >
            <div>
              <p>
                <EnvironmentOutlined />
                {hotel.city},
                {hotel.address}
              </p>
              <p>
                <StarFilled style={{ color: '#faad14' }} />
                <Rate disabled defaultValue={parseFloat(hotel.star_rating)} allowHalf />
              </p>
              <h4 style={{ marginTop: 0 }}>This property offers:</h4>
              <div>
                {hotel.breakfast && <Tag color="blue">Breakfast included</Tag>}
                {hotel.lunch_included && <Tag color="blue">Lunch included</Tag>}
                {hotel.dinner_included && <Tag color="blue">Dinner included</Tag>}
                {hotel.free_wifi && <Tag color="blue">Free WiFi</Tag>}
                {hotel.premium_wifi && <Tag color="blue">Premium WiFi</Tag>}
                {hotel.parking && <Tag color="blue">Parking</Tag>}
                {hotel.fitness_center_access && <Tag color="blue">Fitness Center Access</Tag>}
                {hotel.welcome_drink && <Tag color="blue">Welcome Drink</Tag>}
                {hotel.pool_access && <Tag color="blue">Pool Access</Tag>}
                {hotel.beverages && <Tag color="blue">Beverages</Tag>}
              </div>
            </div>
            <div style={{ marginTop: 'auto', fontWeight: 'bold' }}>
              <span>{`Price: Rs. ${hotel.price || 'N/A'}`}</span>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
}

export default HotelList;
