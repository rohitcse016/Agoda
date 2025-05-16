/**
 * @author Rohit Kumar
 */

import { Button, Empty, Pagination, Rate, Result, Skeleton, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import { bookingStatusAsResponse } from '../../utils/responseAsStatus';
import QueryOptions from '../shared/QueryOptions';
import RoomStatusUpdateModal from '../shared/RoomStatusUpdateModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


function Orders() {
  const [statusUpdateModal, setStatusUpdateModal] = useState({ open: false, roomId: null, status: null });

  const [fetchAgain, setFetchAgain] = useState(false);
  const [query, setQuery] = useState({
    action: 'GET',
    booking_id: null,
    user_id: null,
    hotel_id: null,
    room_id: null,
    check_in_date: null,
    check_out_date: null,
    guest_count: 2,
    total_price: 0,
    status: 'any',
  });
  // fetch booking-list API data
  const [loading, error, response] = useFetchData('/hotelbooking', fetchAgain, query);

  // reset query options
  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  const exportCSV = () => {
  if (!response || !response.length) return;

  const headers = [
    'Booking Date', 'Check-In', 'Check-Out', 'Status',
    'Full Name', 'Room', 'Price', 'Guests', 'Rating'
  ];

  const rows = response.map(data => [
    data?.booking_date?.split('T')[0],
    data?.check_in_date?.split('T')[0],
    data?.check_out_date?.split('T')[0],
    bookingStatusAsResponse(data?.status)?.level ?? '',
    data?.full_name ?? '',
    data?.room_name ?? '',
    data?.total_price ?? '',
    data?.guest_count ?? '',
    data?.reviews?.rating ?? 'N/A',
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'hotel_bookings.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportPDF = () => {
  if (!response || !response.length) return;

  const doc = new jsPDF();
  doc.text('Hotel Booking Report', 14, 15);

  const tableData = response.map(data => [
    data?.booking_date?.split('T')[0],
    data?.check_in_date?.split('T')[0],
    data?.check_out_date?.split('T')[0],
    bookingStatusAsResponse(data?.status)?.level ?? '',
    data?.full_name ?? '',
    data?.room_name ?? '',
    data?.total_price ?? '',
    data?.guest_count ?? '',
    data?.reviews?.rating ?? 'N/A',
  ]);

  autoTable(doc, {
    startY: 20,
    head: [[
      'Booking Date', 'Check-In', 'Check-Out', 'Status',
      'Full Name', 'Room', 'Price', 'Guests', 'Rating'
    ]],
    body: tableData,
  });

  doc.save('hotel_bookings.pdf');
};


  return (
    <div>
      {/* booking list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} disabledSearch />
      <div className="mb-4 flex gap-2 justify-end">
        <Button type="primary" onClick={exportCSV}>Export CSV</Button>
        <Button danger type="primary" onClick={exportPDF}>Export PDF</Button>
      </div>


      {/* room list ― content section */}
      <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
        {error ? (
          <Result title='Failed to fetch' subTitle={error} status='error' />
        ) : (
          <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
            {response?.data?.rows?.length === 0 ? (
              <Empty className='mt-10' description={<span>Sorry! Any data was not found.</span>} />
            ) : (
              <div className='table-layout'>
                <div className='table-layout-container'>
                  <table className='data-table'>
                    {/* data table ― head */}
                    <thead className='data-table-head'>
                      <tr className='data-table-head-tr'>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booking Dates
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          From
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          To
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booking Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booked By
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booked Room
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Price
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          No of Persons
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Ratings
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booking Actions
                        </th>
                      </tr>
                    </thead>

                    {/* data table ― body */}
                    <tbody>
                      {response?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td'>{data?.booking_date.split('T', 1)}</td>
                          <td className='data-table-body-tr-td'>{data?.check_in_date.split('T', 1)}</td>
                          <td className='data-table-body-tr-td'>{data?.check_out_date.split('T', 1)}</td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag className='w-[100px] text-center uppercase' color={bookingStatusAsResponse(data?.status).color}>
                              {bookingStatusAsResponse(data?.status).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td'>{data?.full_name}</td>
                          <td className='data-table-body-tr-td'>{data?.room_name}</td>
                          <td className='data-table-body-tr-td'>{data?.total_price}</td>
                          <td className='data-table-body-tr-td'>{data?.guest_count}</td>
                          <Tooltip title={data?.reviews?.message} placement='top' trigger='hover'>
                            <td className='data-table-body-tr-td text-center'>{<Rate value={4} disabled />}</td>
                          </Tooltip>
                          <td className='data-table-body-tr-td !px-0 text-center'>
                            {data?.status == 'cancel' && data?.status !== 'rejected' && data?.status !== 'in-reviews' && data?.status !== 'completed' ? (
                              <Button
                                className='inline-flex items-center !px-2'
                                type='primary'
                                onClick={() =>
                                  setStatusUpdateModal((prevState) => ({
                                    ...prevState,
                                    open: true,
                                    roomId: data?.id,
                                    status: data?.booking_status,
                                  }))
                                }
                              >
                                Update Status
                              </Button>
                            )
                              : (
                                'NA'
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Skeleton>
        )}
      </div>

      {/* booking list ― pagination */}
      {response?.data?.total_page > 1 && <Pagination className='my-5' onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))} total={response?.data?.total_page * 10} current={response?.data?.current_page} />}

      {/* room status update modal component */}
      {statusUpdateModal?.open && <RoomStatusUpdateModal statusUpdateModal={statusUpdateModal} setStatusUpdateModal={setStatusUpdateModal} setFetchAgain={setFetchAgain} />}
    </div>
  );
}

export default Orders;
