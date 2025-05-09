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
import { getSessionUser } from '../../utils/authentication';
import notificationWithIcon from '../../utils/notification';
import QueryOptions from '../shared/QueryOptions';

const { confirm } = Modal;

function UsersList({ add }) {
  const user = getSessionUser();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [query, setQuery] = useState({
    action_type: 'GET',
    user_id: null,
    username: '',
    email: '',
    password_hash: '',
    full_name: '',
    phone: '',
    gender: '',
    dob: null,
    address: '',
    role: ''
  });
  // fetch user-list API data
  const [loading, error, response] = useFetchData('/employee', fetchAgain, query);
  // reset query options
  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.full_name]);

  // function to handle delete user
  const handleDeleteUser = (id) => {
    confirm({
      title: 'DELETE USER',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure delete this User permanently?',
      onOk() {
        return new Promise((resolve, reject) => {
          ApiService.post('/employee', { ...query, action_type: 'DELETE', user_id: id })
            .then((res) => {
              if (res?.success) {
                notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'User delete successful');
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
      {/* user list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} />

      {/* user list ― content section */}
      <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
        {error ? (
          <Result
            title='Failed to fetch'
            subTitle={error}
            status='error'
          />
        ) : (
          <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
            {response?.length === 0 ? (
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
                          Avatar
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Full Name
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Username
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Email
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Phone
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Role
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Password
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Verified
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          User Actions
                        </th>
                      </tr>
                    </thead>

                    {/* data table ― body */}
                    <tbody>
                      {response && response?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td text-center'>
                            <Avatar src={data?.avatar} crossOrigin='anonymous' />
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.full_name}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.username}
                          </td>
                          <td className='data-table-body-tr-td !lowercase'>
                            {data?.email}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.phone}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[60px] text-center uppercase'
                              color={data?.UserRole === 'admin' ? 'magenta' : 'purple'}
                            >
                              {data?.UserRole}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            {/* <Tag
                              className='w-[70px] text-center uppercase'
                              color={userStatusAsResponse(data?.status).color}
                            >
                            </Tag> */}
                            {data?.password_hash}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[50px] text-center uppercase'
                              color={data?.verified ? 'success' : 'error'}
                            >
                              {data?.verified ? 'Yes' : 'No'}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td !px-0 text-center'>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => add(data?.user_id)}
                              type='link'
                            >
                              View
                            </Button>
                            {user[0]?.UserID !== data?.user_id && (
                              <Button
                                className='inline-flex items-center !px-2'
                                onClick={() => handleDeleteUser(data?.user_id)}
                                type='link'
                              >
                                Delete
                              </Button>
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

      {/* user list ― pagination */}
      {response?.data?.total_page > 1 && (
        <Pagination
          className='my-5'
          onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))}
          total={response?.data?.total_page * 10}
          current={response?.data?.current_page}
        />
      )}
    </div>
  );
}

export default React.memo(UsersList);
