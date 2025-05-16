import React, { useState, useEffect } from 'react';
import {
  Table, Input, Tag, Space, Modal, Button, Descriptions, Typography, message
} from 'antd';
import {
  SearchOutlined, FilePdfOutlined, FileExcelOutlined
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ApiService from '../../utils/apiService';
import dayjs from 'dayjs';

const TrainBookingHistory = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [query] = useState({ action: 'GET' });
  const [billingInfo, setBillingInfo] = useState(null);


  useEffect(() => {
    fetchTrainBookings();
  }, []);

  const fetchTrainBookings = () => {
    setLoading(true);
    ApiService.post('/trainbooking', query)
      .then((res) => {
        setLoading(false);
        if (res?.success) {
          setData(res.data);
        } else {
          message.error('Failed to fetch data');
        }
      })
      .catch(() => {
        setLoading(false);
        message.error('Something went wrong while fetching train bookings.');
      });
  };
  
  const showDetails = async (record) => {
  setSelectedBooking(record);
  setIsModalVisible(true);
  setBillingInfo(null);

  try {
    const billingRes = await ApiService.post('/billings', {
      action: 'GET',
      booking_type: 'train',
      booking_id: record.booking_id,
    });

    if (billingRes?.success && billingRes.data?.length) {
      setBillingInfo(billingRes.data[0]); // Assuming one billing per booking
    } else {
      setBillingInfo(null);
    }
  } catch (error) {
    message.warning("Failed to load billing info");
    setBillingInfo(null);
  }
};


  const filteredData = data.filter(item =>
    item?.user_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const exportCSV = () => {
    if (!filteredData.length) return;

    const headers = Object.keys(filteredData[0]);
    const csvRows = [
      headers.join(','),
      ...filteredData.map(row =>
        headers.map(field =>
          `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`
        ).join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'train_bookings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Train Booking Report', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['User', 'Train', 'From', 'To', 'Date', 'Status', 'Total']],
      body: filteredData.map(item => [
        item.user_name,
        item.train_name,
        item.departure_station,
        item.arrival_station,
        dayjs(item.departure_date).format('DD-MMM-YYYY'),
        item.status,
        `₹${item.total_price ?? 0}`,
      ]),
    });

    doc.save('train_bookings.pdf');
  };

  const columns = [
    { title: 'User', dataIndex: 'user_name', key: 'user_name' },
    { title: 'Train', dataIndex: 'train_name', key: 'train_name' },
    { title: 'From', dataIndex: 'departure_station', key: 'departure_station' },
    { title: 'To', dataIndex: 'arrival_station', key: 'arrival_station' },
    {
      title: 'Date', dataIndex: 'departure_date', key: 'departure_date',
      render: date => <Typography>{dayjs(date).format('DD-MMM-YYYY')}</Typography>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Completed' ? 'green' : status === 'Cancelled' ? 'volcano' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Total (₹)',
      key: 'total_price',
      dataIndex: 'total_price'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => showDetails(record)}>View</Button>
      ),
    },
  ];



  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto' }}>
      <h2>Train Booking History (Admin)</h2>

      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Search by user"
          prefix={<SearchOutlined />}
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<FileExcelOutlined />} onClick={exportCSV}>Export CSV</Button>
        <Button type="primary" danger icon={<FilePdfOutlined />} onClick={exportPDF}>Export PDF</Button>
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
        title="Train Booking Details"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedBooking(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={Math.min(window.innerWidth * 0.7, 900)}
        destroyOnClose
      >
        {selectedBooking && (
          <>
            <Descriptions bordered column={{ xs: 1, md: 2 }} size="small" title="Trip Info">
              <Descriptions.Item label="User Name">{selectedBooking.user_name}</Descriptions.Item>
              <Descriptions.Item label="Train Name">{selectedBooking.train_name}</Descriptions.Item>
              <Descriptions.Item label="From">{selectedBooking.departure_station}</Descriptions.Item>
              <Descriptions.Item label="To">{selectedBooking.arrival_station}</Descriptions.Item>
              <Descriptions.Item label="Date">{dayjs(selectedBooking.departure_date).format('DD-MMM-YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Booking ID">{selectedBooking.booking_id}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedBooking.status === 'Completed' ? 'green' : selectedBooking.status === 'Cancelled' ? 'volcano' : 'blue'}>
                  {selectedBooking.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions bordered column={{ xs: 1, md: 2 }} size="small" title="Billing Info" style={{ marginTop: 20 }}>
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

export default TrainBookingHistory;
