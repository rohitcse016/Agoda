import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Tag,
  Space,
  Modal,
  Button,
  Descriptions,
  message,
  Typography,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import { render } from 'react-dom';

import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const CarBookingHistory = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ action: 'GET' });
  const [error, setError] = useState('');
   const [billingInfo, setBillingInfo] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
  const [data, setData] = useState([
  {
    id: 1,
    userName: 'Priya Sharma',
    carModel: 'Toyota Innova',
    pickupLocation: 'Bangalore Airport',
    dropLocation: 'Mysore',
    date: '2025-05-21',
    status: 'Completed',
    bookingId: 'CB00123',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    billing: {
      fare: 2500,
      taxes: 300,
      discount: 100,
      total: 2700,
      paymentMethod: 'Credit Card',
      transactionId: 'CAR-TXN-123',
    },
  },
  {
    id: 2,
    userName: 'Ravi Patel',
    carModel: 'Hyundai Verna',
    pickupLocation: 'Ahmedabad Station',
    dropLocation: 'Surat',
    date: '2025-06-11',
    status: 'Cancelled',
    bookingId: 'CB00456',
    email: 'ravi@example.com',
    phone: '+91-9123456782',
    billing: {
      fare: 1800,
      taxes: 200,
      discount: 0,
      total: 2000,
      paymentMethod: 'UPI',
      transactionId: 'CAR-TXN-456',
    },
  },
]);
  // const [loading, error, response] = useFetchData("/carbooking", false, query);


  // const filteredData = data.filter(item =>
  //   item?.user_name?.toLowerCase().includes(searchText.toLowerCase())
  // );

    const filteredData = data.filter(item => {
      const matchesUser = item?.user_name?.toLowerCase().includes(searchText.toLowerCase());
      if (!matchesUser) return false;
  
      if (dateRange[0] && dateRange[1]) {
        const departureDate = dayjs(item?.booking_date).valueOf();
        const from = dayjs(dateRange[0]).valueOf();
        const to = dayjs(dateRange[1]).valueOf();
  
        return departureDate >= from && departureDate <= to;
      }
  
      return true;
    });


  // 🔁 Fetch booking data on mount
  useEffect(() => {
    fetchCarBookings();
  }, []);
  
   const showDetails = async (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
    setBillingInfo(null);
    console.log(record);
    

    try {
      const billingRes = await ApiService.post('/billings', {
        action: 'GET',
        booking_type: 'car',
        booking_id: record.booking_id,
      });

      if (billingRes?.success && billingRes.data?.length) {
        setBillingInfo(billingRes.data[0]);
      } else {
        setBillingInfo(null);
      }
    } catch (error) {
      message.warning("Failed to load billing info");
      setBillingInfo(null);
    }
  };


  const fetchCarBookings = () => {
    ApiService.post('/carbooking',query)
      .then((res) => {
        setLoading(false);
        if (res?.success) {
          setData(res?.data);
        } else {
          setError('Sorry! Something went wrong. App server error');
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
        setLoading(false);
      });
  }

const exportCSV = () => {
  if (!filteredData.length) return;

  const headers = Object.keys(filteredData[0])
    .filter(k => k !== 'billing')
    .concat(Object.keys(filteredData[0].billing || {}).map(k => `billing.${k}`));

  const csvRows = [
    headers.join(','),
    ...filteredData.map(row => {
      const flatRow = {
        ...row,
        ...Object.fromEntries(
          Object.entries(row.billing || {}).map(([k, v]) => [`billing.${k}`, v])
        ),
      };
      return headers.map(field =>
        `"${(flatRow[field] ?? '').toString().replace(/"/g, '""')}"`
      ).join(',');
    }),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'car_bookings.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportPDF = () => {
  const doc = new jsPDF();
  doc.text('Car Booking Report', 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [['User', 'Car', 'Pickup', 'Drop', 'Date', 'Status', 'Total']],
    body: filteredData.map(item => [
      item.user_name,
      item.carModel,
      item.pickup_location,
      item.dropoff_location,
      item.pickupDate,
      item.status,
      `₹${item.total_price ?? 0}`,
    ]),
  });

  doc.save('car_bookings.pdf');
};

const columns = [
  { title: 'User', dataIndex: 'user_name', key: 'userName' },
  { title: 'Car Model', dataIndex: 'carModel', key: 'carModel' },
  { title: 'Pickup', dataIndex: 'pickup_location', key: 'pickup_location' },
  { title: 'Drop', dataIndex: 'dropoff_location', key: 'dropoff_location' },
  { title: 'Date', dataIndex: 'booking_date', key: 'booking_date' ,
    render:(data)=><Typography>{dayjs(data).format('DD-MMM-YYYY')}</Typography>
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <Tag color={status === 'Completed' ? 'green' : 'volcano'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Total (₹)',
    key: 'total',
    render: (_, record) => record.total_price ?? 'N/A',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Button type="link" onClick={() => showDetails(record)}>
        View
      </Button>
    ),
  },
];

return (
  <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
    <h2>Car Booking History (Admin)</h2>

    <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
      <Input
        placeholder="Search by user"
        prefix={<SearchOutlined />}
        onChange={e => setSearchText(e.target.value)}
        value={searchText}
        style={{ width: 300 }}
      />
       <RangePicker
                onChange={(dates) => setDateRange(dates)}
                // value={dateRange}
                allowClear={false}
                style={{ marginLeft: 8 }}
                format="DD-MMM-YYYY"
                placeholder={['From Date', 'To Date']}
              />
              <Button onClick={() => setDateRange([null, null])} style={{ marginLeft: 4 }}>
                Clear Dates
              </Button>
      <Button type="primary" icon={<FileExcelOutlined />} onClick={exportCSV}>
        Export CSV
      </Button>
      <Button type="primary" danger icon={<FilePdfOutlined />} onClick={exportPDF}>
        Export PDF
      </Button>
    </Space>

    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 5 }}
      scroll={{ x: 1000 }}
    />

    <Modal
      title="Car Booking Details"
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setSelectedBooking(null);
      }}
      footer={[
        <Button key="close" onClick={() => setIsModalVisible(false)}>
          Close
        </Button>,
      ]}
      width={Math.min(window.innerWidth * 0.7, 900)}
      destroyOnClose
    >
      {selectedBooking && (
        <>
          <Descriptions
            bordered
            column={{ xs: 1, md: 2 }}
            size="small"
            title="Trip Details"
          >
            <Descriptions.Item label="User Name">{selectedBooking.user_name}</Descriptions.Item>
            <Descriptions.Item label="Car Model">{selectedBooking.carModel}</Descriptions.Item>
            <Descriptions.Item label="Pickup">{selectedBooking.pickup_location}</Descriptions.Item>
            <Descriptions.Item label="Drop">{selectedBooking.dropoff_location}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedBooking.booking_date}</Descriptions.Item>
            <Descriptions.Item label="Booking ID">{selectedBooking.id}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedBooking.status === 'Completed' ? 'green' : 'volcano'}>
                {selectedBooking.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Email">{selectedBooking.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedBooking.phone}</Descriptions.Item>
          </Descriptions>

          <Descriptions
            bordered
            column={{ xs: 1, md: 2 }}
            size="small"
            title="Billing Details"
            style={{ marginTop: 20 }}
          >
             {billingInfo ? (
          <>
            <Descriptions.Item label="Fare">₹{billingInfo.fare}</Descriptions.Item>
            <Descriptions.Item label="Taxes">₹{billingInfo.taxes}</Descriptions.Item>
            <Descriptions.Item label="Discount">₹{billingInfo.discount}</Descriptions.Item>
            <Descriptions.Item label="Total">₹{billingInfo.total}</Descriptions.Item>
            <Descriptions.Item label="Payment Method">{billingInfo.payment_method}</Descriptions.Item>
            <Descriptions.Item label="Transaction ID">{billingInfo.transaction_id}</Descriptions.Item>
          </>
        ) : (
          <Descriptions.Item span={2}>No billing information available.</Descriptions.Item>
        )}
          </Descriptions>
        </>
      )}
    </Modal>
  </div>
);
};

export default CarBookingHistory;
