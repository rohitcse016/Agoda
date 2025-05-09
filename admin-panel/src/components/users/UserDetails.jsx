/**
 * @author Rohit Kumar
 */

import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Button, Descriptions, Image, Modal, Result, Skeleton, Tag
} from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import useFetchData from '../../hooks/useFetchData';
import { reFetchData } from '../../store/slice/appSlice';
import ApiService from '../../utils/apiService';
import { getSessionUser } from '../../utils/authentication';
import notificationWithIcon from '../../utils/notification';
import { userStatusAsResponse } from '../../utils/responseAsStatus';

const { confirm } = Modal;

function UserDetails({ id }) {
  const dispatch = useDispatch();
  const user = getSessionUser();

  const param = {
    action_type: 'GET',
    user_id: id,
    username: 'any',
    email: '',
    password_hash: 'any',
    full_name: 'any',
    phone: '',
    role: '',
    gender: '',
    dob: dayjs().format('YYYY-MM-DD'),
    address: ''
  };
  // fetch user-details API data
  const [loading, error, response] = useFetchData('/employee', false, param);
  // console.log(response&& response[0]);

  // function to handle blocked user
  const blockedUser = () => {
    confirm({
      title: 'BLOCKED USER',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure blocked this user?',
      onOk() {
        return new Promise((resolve, reject) => {
          ApiService.put(`/api/v1/blocked-user/${id}`)
            .then((res) => {
              if (res?.result_code === 0) {
                notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'User blocked successful');
                dispatch(reFetchData());
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

  // function to handle unblocked user
  const unblockedUser = () => {
    confirm({
      title: 'UNBLOCKED USER',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure unblocked this user?',
      onOk() {
        return new Promise((resolve, reject) => {
          ApiService.put(`/api/v1/unblocked-user/${id}`)
            .then((res) => {
              if (res?.result_code === 0) {
                notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'User unblocked successful');
                dispatch(reFetchData());
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
    <Skeleton loading={loading} paragraph={{ rows: 10 }} active avatar>
      {error ? (
        <Result
          title='Failed to fetch'
          subTitle={error}
          status='error'
        />
      ) : (response &&
        <Descriptions
          title='User Information'
          bordered
          extra={user?.user_id !== id && (response?.data?.status === 'blocked' ? (
            <Button onClick={unblockedUser} type='default' danger>
              Unblocked User
            </Button>
          ) : (
            <Button onClick={blockedUser} type='default' danger>
              Blocked User
            </Button>
          ))}
        >
          <Descriptions.Item label='Avatar' span={3}>
            {response?.data?.avatar ? (
              <Image
                className='!w-[100px] !h-[100px]'
                src={response?.data?.avatar}
                crossOrigin='anonymous'
                alt='user-image'
              />
            ) : 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label='Full Name'>
            {response[0]?.full_name}
          </Descriptions.Item>
          <Descriptions.Item label='User Name' span={2}>
            {response[0]?.username}
          </Descriptions.Item>
          <Descriptions.Item label='Email'>
            {response[0]?.email}
          </Descriptions.Item>
          <Descriptions.Item label='Phone' span={2}>
            {response[0]?.phone}
          </Descriptions.Item>

          <Descriptions.Item label='Role'>
            <Tag
              className='w-[60px] text-center uppercase'
              color={response[0]?.UserRole === 'admin' ? 'magenta' : 'purple'}
            >
              {response[0]?.UserRole}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Status' span={2}>
            <Tag
              className='w-[70px] text-center uppercase'
              color={userStatusAsResponse(response?.data?.status).color}
            >
              {userStatusAsResponse(response?.data?.status).level}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Verified'>
            <Tag
              className='w-[50px] text-center uppercase'
              color={response?.data?.verified ? 'success' : 'error'}
            >
              {response?.data?.verified ? 'Yes' : 'No'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Date Of Birth' span={2}>
            {response?.data?.dob?.split('T')[0] || 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label='User Last Update Date'>
            {response?.data?.updatedAt?.split('T')[0]}
          </Descriptions.Item>
          <Descriptions.Item label='User Registration Date' span={2}>
            {response?.data?.createdAt?.split('T')[0]}
          </Descriptions.Item>

          <Descriptions.Item label='Address' span={3}>
            {response?.data?.address}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Skeleton>
  );
}

export default React.memo(UserDetails);
