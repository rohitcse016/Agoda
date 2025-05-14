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

  return (
    <div>
      {/* booking list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} disabledSearch />

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
                          Booking Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booked By
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booked Room
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Review & Ratting
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
                          <td className='data-table-body-tr-td text-center'>
                            <Tag className='w-[100px] text-center uppercase' color={bookingStatusAsResponse(data?.status).color}>
                              {bookingStatusAsResponse(data?.status).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td'>{data?.booking_by?.full_name}</td>
                          <td className='data-table-body-tr-td'>{data?.room?.room_name}</td>
                          <Tooltip title={data?.reviews?.message} placement='top' trigger='hover'>
                            <td className='data-table-body-tr-td text-center'>{data?.reviews ? <Rate value={data?.reviews?.rating} disabled /> : 'N/A'}</td>
                          </Tooltip>
                          <td className='data-table-body-tr-td !px-0 text-center'>
                            {data?.status !== 'cancel' && data?.status !== 'rejected' && data?.status !== 'in-reviews' && data?.status !== 'completed' ? (
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
                            ) : (
                              'Action Not Possible!'
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
