/**
 * @author Rohit Kumar
 */

import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Avatar, Button, Empty, Modal, Pagination, Result, Skeleton, Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import { roomStatusAsResponse, roomTypeAsColor } from '../../utils/responseAsStatus';
import QueryOptions from '../shared/QueryOptions';
import RoomEdit from './RoomEdit';

const { confirm } = Modal;

function RoomsList({ add,hotel_id }) {
  const [query, setQuery] = useState({
  action: 'GET',
  room_id: null,
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
}
);
  const [roomEditModal, setRoomEditModal] = useState(
    { open: false, room_id: null,hotel_id:null }
  );
  const [fetchAgain, setFetchAgain] = useState(false);

  // fetch room-list API data
  const [loading, error, response] = useFetchData(`/hotelroom`, fetchAgain,query);

  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  // function to handle delete
  const handleDeleteRoom = (id) => {
    confirm({
      title: 'DELETE ROOM',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure delete this Room permanently?',
      onOk() {
        return new Promise((resolve, reject) => {
          ApiService.delete('/hotelroom')
            .then((res) => {
              if (res?.success) {
                notificationWithIcon('success', 'SUCCESS', res?.data?.message || 'Room delete successful');
                setFetchAgain(!fetchAgain);
                resolve();
              } else {
                notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
                reject();
              }
            })
            .catch((err) => {
              notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || err?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
              reject();
            });
        }).catch(() => notificationWithIcon('error', 'ERROR', 'Oops errors!'));
      }
    });
  };

  return (
    <div>
      {/* room list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} />

      {/* room list ― content section */}
      <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
        {error ? (
          <Result
            title='Failed to fetch'
            subTitle={error}
            status='error'
          />
        ) : (
          <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
            {response?.data?.rows?.length === 0 ? (
              <Empty
                className='mt-10'
                description={(<span>Sorry! Any data was not found.</span>)}
              />
            ) : (
              <div className='table-layout'>
                <div className='table-layout-container'>
                  <table className='data-table'>
                    {/* data table ― head */}
                    <thead className='data-table-head'>
                      <tr className='data-table-head-tr'>
                        <th className='data-table-head-tr-th' scope='col'>
                          Images
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Room Name
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Room Type
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Room Price
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Room Size
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Room Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Room Actions
                        </th>
                      </tr>
                    </thead>

                    {/* data table ― body */}
                    <tbody>
                      {response?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td'>
                            <Avatar.Group>
                              {data?.images?.map((image) => (
                                <Avatar
                                  key={uniqueId()}
                                  src={`http://localhost:5000/${image}`}
                                  crossOrigin='anonymous'
                                  size='large'
                                />
                              ))}
                            </Avatar.Group>
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.room_name}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='text-center uppercase'
                              color={roomTypeAsColor(data?.room_type)}
                            >
                              {data?.room_type}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td !lowercase'>
                            {`$ ${data?.room_price}`}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {`${data?.room_size} sq. ft.`}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[80px] text-center uppercase'
                              color={roomStatusAsResponse(data?.room_status).color}
                            >
                              {roomStatusAsResponse(data?.room_status).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td !px-0 text-center'>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => add(data?.room_id)}
                              type='link'
                            >
                              View
                            </Button>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => setRoomEditModal(
                                (prevState) => ({ ...prevState, open: true, room_id: data?.room_id,hotel_id:data?.hotel_id })
                              )}
                              type='link'
                            >
                              Edit
                            </Button>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => handleDeleteRoom(data?.id)}
                              type='link'
                            >
                              Delete
                            </Button>
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

      {/* room list ― pagination */}
      {response?.data?.total_page > 1 && (
        <Pagination
          className='my-5'
          onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))}
          total={response?.data?.total_page * 10}
          current={response?.data?.current_page}
        />
      )}

      {/* room edit modal component */}
      {roomEditModal.open && (
        <RoomEdit
          roomEditModal={roomEditModal}
          setRoomEditModal={setRoomEditModal}
        />
      )}
    </div>
  );
}

export default React.memo(RoomsList);
