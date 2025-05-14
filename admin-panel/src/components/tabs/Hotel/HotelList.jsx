import React, { useState } from 'react';
import {
  List, Card, Button, Rate, Tag, Tooltip, Row, Col, Typography, Image, Badge, Input
} from 'antd';
import {
  EditOutlined, DeleteOutlined, EnvironmentOutlined, HeartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;
const { Search } = Input;

function HotelList({ hotels, editHotel, deleteHotel }) {
  const [searchText, setSearchText] = useState('');

  const filteredHotels = hotels.filter((hotel) => {
    return hotel.name.toLowerCase().includes(searchText.toLowerCase())
    // hotel.city.toLowerCase().includes(searchText.toLowerCase())
  }
  );
  const navigate = useNavigate();

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search hotels by name or city"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={(value) => setSearchText(value)}
        />
      </div>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredHotels}
        renderItem={(hotel) => (
          <List.Item>
            <Card bordered={false} style={{ borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: 'initial' }}>
              <Row gutter={16}>
                {/* Clickable Area */}
                <Col span={18} onClick={() => navigate('/main/rooms', 
                {state: {
                    params: {
                      hotel_id:hotel?.hotel_id
                    }
                  }
                })} style={{ cursor: 'pointer' }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Badge.Ribbon text="20th B-DAY SALE" color="#722ed1">
                        <Image
                          src={`http://localhost:5000${hotel?.image_path}`}
                          alt={`Image of ${hotel.name}`}
                          width="100%"
                          height={200}
                          style={{ objectFit: 'cover', borderRadius: 8 }}
                          fallback="https://via.placeholder.com/300x200?text=No+Image"
                        />
                      </Badge.Ribbon>
                      <Row gutter={8} style={{ marginTop: 8 }}>
                        <Col span={6}><Image src="https://via.placeholder.com/50" /></Col>
                        <Col span={6}><Image src="https://via.placeholder.com/50" /></Col>
                        <Col span={6}><Image src="https://via.placeholder.com/50" /></Col>
                        <Col span={6}><Button type="link">See all</Button></Col>
                      </Row>
                    </Col>

                    <Col span={16}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Title level={4} style={{ marginBottom: 0 }}>{hotel.name}</Title>
                        <HeartOutlined style={{ fontSize: 20, color: '#999' }} />
                      </div>
                      <Rate disabled defaultValue={parseFloat(hotel.star_rating)} allowHalf style={{ fontSize: 14 }} />
                      <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                        <EnvironmentOutlined /> {hotel.city}, {hotel.address}
                      </Text>

                      <div style={{ marginTop: 12 }}>
                        <Text strong>This property offers:</Text>
                        <div style={{ marginTop: 4 }}>
                          {hotel.breakfast && <Tag color="blue">Breakfast</Tag>}
                          {hotel.lunch_included && <Tag color="blue">Lunch</Tag>}
                          {hotel.dinner_included && <Tag color="blue">Dinner</Tag>}
                          {hotel.free_wifi && <Tag color="blue">Free WiFi</Tag>}
                          {hotel.premium_wifi && <Tag color="blue">Premium WiFi</Tag>}
                          {hotel.parking && <Tag color="blue">Parking</Tag>}
                          {hotel.fitness_center_access && <Tag color="blue">Fitness Center</Tag>}
                          {hotel.welcome_drink && <Tag color="blue">Welcome Drink</Tag>}
                          {hotel.pool_access && <Tag color="blue">Pool</Tag>}
                          {hotel.beverages && <Tag color="blue">Beverages</Tag>}
                        </div>
                      </div>

                      <Text type="danger" style={{ marginTop: 8, display: 'block' }}>
                        🔥 Booked 15 times since yesterday
                      </Text>
                    </Col>
                  </Row>
                </Col>

                {/* Edit/Delete Area */}
                <Col span={6} style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <Text type="secondary" strong style={{ fontSize: 16 }}>
                      <span style={{ color: '#1677ff' }}>
                        {hotel.star_rating > 2.5 ? `${hotel.star_rating} Excellent` : `${hotel.star_rating} Poor`}
                      </span>
                      <br />
                      6,198 reviews
                    </Text>
                    <div style={{ marginTop: 12 }}>
                      <Tag color="red">MEGA SALE</Tag>
                      <div style={{ marginTop: 4 }}>
                        <Text delete style={{ fontSize: 16 }}>₹23,406</Text>
                        <Text type="danger" style={{ marginLeft: 8 }}>-62%</Text>
                      </div>
                      <Text strong style={{ fontSize: 20, color: '#cf1322' }}>
                        ₹{hotel.hotel_price || 'N/A'}
                      </Text>
                      <div><small>Per night before taxes and fees</small></div>
                    </div>
                  </div>

                  <div>
                    <Tooltip title="Edit">
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          editHotel(hotel);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHotel(hotel);
                        }}
                      />
                    </Tooltip>
                  </div>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />

    </>
  );
}

export default HotelList;
