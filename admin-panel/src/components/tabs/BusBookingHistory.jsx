import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Tag,
  Space,
  Modal,
  Button,
  Descriptions,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ApiService from '../../utils/apiService';
import { render } from 'react-dom';
import dayjs from 'dayjs';

const mockBusData = [
  {
    id: 1,
    userName: 'Alice Brown',
    busNumber: 'BUS-101',
    from: 'Delhi',
    to: 'Manali',
    date: '2025-05-20',
    status: 'Confirmed',
    seat: 'B4',
    bookingId: 'BB00123',
    email: 'alice@example.com',
    phone: '+91-9876543210',
    billing: {
      fare: 1200,
      taxes: 100,
      discount: 50,
      total: 1250,
      paymentMethod: 'UPI',
      transactionId: 'TXN00123ABC',
    },
  },
  {
    id: 2,
    userName: 'Bob Green',
    busNumber: 'BUS-102',
    from: 'Mumbai',
    to: 'Goa',
    date: '2025-06-10',
    status: 'Cancelled',
    seat: 'C2',
    bookingId: 'BB00456',
    email: 'bob@example.com',
    phone: '+91-9123456789',
    billing: {
      fare: 1500,
      taxes: 150,
      discount: 0,
      total: 1650,
      paymentMethod: 'Credit Card',
      transactionId: 'TXN00456XYZ',
    },
  },
];

const BusBookingHistory = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [query, setQuery] = useState({ action: 'GET' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(mockBusData);
  }, []);

    useEffect(() => {
    fetchCarBookings();
  }, []);

  const fetchCarBookings = () => {
    ApiService.post('/busbooking/',query)
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

  const showDetails = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const exportCSV = () => {
    const headers = Object.keys(data[0])
      .filter(k => k !== 'billing')
      .concat(Object.keys(data[0].billing).map(k => `billing.${k}`));

    const csvRows = [
      headers.join(','),
      ...data.map(row => {
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
    link.setAttribute('download', 'bus_bookings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Bus Booking Report', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['User', 'Bus', 'From', 'To', 'Date', 'Status', 'Total']],
      body: data.map(item => [
        item.userName,
        item.busNumber,
        item.from,
        item.to,
        item.date,
        item.status,
        `₹${item.billing?.total ?? 0}`,
      ]),
    });

    doc.save('bus_bookings.pdf');
  };

  const columns = [
    { title: 'User', dataIndex: 'user_fullname', key: 'userName' },
    { title: 'Bus', dataIndex: 'bus_id', key: 'bus_id' },
    { title: 'From', dataIndex: 'boarding_point', key: 'boarding_point' },
    { title: 'To', dataIndex: 'dropping_point', key: 'dropping_point' },
    { title: 'Date', dataIndex: 'booking_date', key: 'booking_date',
      render:(data)=> <Typography>{dayjs(data).format('DD-MMM-YYYY')}</Typography>
     },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Confirmed' ? 'green' : 'volcano'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Total (₹)',
      key: 'total_price',
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
      <h2>Bus Booking History (Admin)</h2>

      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Search by user"
          prefix={<SearchOutlined />}
          onChange={e => {
            const v = e.target.value.toLowerCase();
            setSearchText(v);
            setData(
              mockBusData.filter(item =>
                item.userName.toLowerCase().includes(v)
              ),
            );
          }}
          value={searchText}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<FileExcelOutlined />} onClick={exportCSV}>
          Export CSV
        </Button>
        <Button type="primary" danger icon={<FilePdfOutlined />} onClick={exportPDF}>
          Export PDF
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title="Bus Booking Details"
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
              title="Journey Details"
            >
              <Descriptions.Item label="User Name">{selectedBooking.user_fullname}</Descriptions.Item>
              <Descriptions.Item label="Bus Number">{selectedBooking.bus_id}</Descriptions.Item>
              <Descriptions.Item label="From">{selectedBooking.boarding_point}</Descriptions.Item>
              <Descriptions.Item label="To">{selectedBooking.dropping_point}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedBooking.booking_date}</Descriptions.Item>
              <Descriptions.Item label="No of Seats">{selectedBooking.seat_count}</Descriptions.Item>
              <Descriptions.Item label="Booking ID">{selectedBooking.id}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedBooking.status === 'Confirmed' ? 'green' : 'volcano'}>
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
              <Descriptions.Item label="Fare">₹{selectedBooking.billing?.fare}</Descriptions.Item>
              <Descriptions.Item label="Taxes">₹{selectedBooking.billing?.taxes}</Descriptions.Item>
              <Descriptions.Item label="Discount">₹{selectedBooking.billing?.discount}</Descriptions.Item>
              <Descriptions.Item label="Total">₹{selectedBooking.billing?.total}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedBooking.billing?.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Transaction ID">{selectedBooking.billing?.transactionId}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default BusBookingHistory;
