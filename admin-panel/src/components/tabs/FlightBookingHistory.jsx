import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Tag,
  Space,
  Modal,
  Button,
  Descriptions,
} from 'antd';
import {
  SearchOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const mockData = [
  {
    id: 1,
    userName: 'John Doe',
    flightNumber: 'AI-202',
    from: 'New York',
    to: 'London',
    date: '2025-05-10',
    status: 'Confirmed',
    seat: '12A',
    bookingId: 'BK123456',
    email: 'john@example.com',
    phone: '+1-202-555-0182',
    billing: {
      fare: 500,
      taxes: 50,
      discount: 20,
      total: 530,
      paymentMethod: 'Credit Card',
      transactionId: 'TXN987654321',
    },
  },
  {
    id: 2,
    userName: 'Jane Smith',
    flightNumber: 'EK-380',
    from: 'Dubai',
    to: 'Sydney',
    date: '2025-04-28',
    status: 'Cancelled',
    seat: '9C',
    bookingId: 'BK654321',
    email: 'jane@example.com',
    phone: '+61-412-345-678',
    billing: {
      fare: 700,
      taxes: 60,
      discount: 0,
      total: 760,
      paymentMethod: 'PayPal',
      transactionId: 'TXN123456789',
    },
  },
];

const FlightBookingHistory = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setData(mockData);
  }, []);

  const showDetails = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const exportCSV = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0])
      .filter(k => k !== 'billing')
      .concat(Object.keys(data[0].billing).map(k => `billing.${k}`));

    const csvRows = [
      headers.join(','), // header row
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
    link.setAttribute('download', 'flight_bookings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
   const doc = new jsPDF();
doc.text('Flight Booking Report', 14, 15);

autoTable(doc, {
  startY: 20,
  head: [['User', 'Flight', 'From', 'To', 'Date', 'Status', 'Total ($)']],
  body: data.map(item => [
    item.userName,
    item.flightNumber,
    item.from,
    item.to,
    item.date,
    item.status,
    `$${item.billing?.total ?? 0}`,
  ]),
});

doc.save('flight_bookings.pdf');

  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Flight',
      dataIndex: 'flightNumber',
      key: 'flightNumber',
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Confirmed' ? 'green' : 'volcano'}>{status}</Tag>
      ),
    },
    {
      title: 'Total ($)',
      key: 'total',
      render: (_, record) => record.billing?.total ?? 'N/A',
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
      <h2>Flight Booking History (Admin)</h2>

      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Search by user"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            const val = e.target.value.toLowerCase();
            setSearchText(val);
            setData(
              mockData.filter((item) =>
                item.userName.toLowerCase().includes(val)
              )
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
        title="Booking Details"
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
              title="Flight Details"
            >
              <Descriptions.Item label="User Name">
                {selectedBooking.userName}
              </Descriptions.Item>
              <Descriptions.Item label="Flight Number">
                {selectedBooking.flightNumber}
              </Descriptions.Item>
              <Descriptions.Item label="From">
                {selectedBooking.from}
              </Descriptions.Item>
              <Descriptions.Item label="To">
                {selectedBooking.to}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {selectedBooking.date}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedBooking.status === 'Confirmed' ? 'green' : 'volcano'}>
                  {selectedBooking.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Seat">{selectedBooking.seat}</Descriptions.Item>
              <Descriptions.Item label="Booking ID">{selectedBooking.bookingId}</Descriptions.Item>
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
              <Descriptions.Item label="Fare">${selectedBooking.billing?.fare}</Descriptions.Item>
              <Descriptions.Item label="Taxes">${selectedBooking.billing?.taxes}</Descriptions.Item>
              <Descriptions.Item label="Discount">${selectedBooking.billing?.discount}</Descriptions.Item>
              <Descriptions.Item label="Total Amount">${selectedBooking.billing?.total}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedBooking.billing?.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Transaction ID">{selectedBooking.billing?.transactionId}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default FlightBookingHistory;