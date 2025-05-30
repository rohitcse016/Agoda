/**
 * @author Rohit Kumar
 */

import {
  DashboardOutlined, FileProtectOutlined, FullscreenExitOutlined, FullscreenOutlined, HomeOutlined, LogoutOutlined,
  RocketOutlined, TeamOutlined, UserOutlined,InsertRowLeftOutlined,
  CarOutlined,
  RadarChartOutlined
} from '@ant-design/icons';
import {
  Button, Layout, Menu, Tooltip
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Logo from '../assets/images/Tajde_Logo.png';
import UserBox from '../components/shared/UserBox';
import Dashboard from '../components/tabs/Dashboard';
import Orders from '../components/tabs/Orders';
import Users from '../components/tabs/Users';
import useFullScreen from '../hooks/useFullScreen';
import ApiService from '../utils/apiService';
import { removeSessionAndLogoutUser } from '../utils/authentication';
import notificationWithIcon from '../utils/notification';
import Hotels from '../components/tabs/Hotels';
import Rooms from '../components/tabs/Rooms';
import MyProfile from '../components/tabs/MyProfile';
import FlightBookingHistory from '../components/tabs/FlightBookingHistory';
import BusBookingHistory from '../components/tabs/BusBookingHistory';
import CarBookingHistory from '../components/tabs/CarBookingHistory';
import TrainBookingHistory from '../components/tabs/TrainBookingHistory';

const {
  Header, Content, Footer, Sider
} = Layout;

function Main() {
  window.document.title = 'Tajde — Main';
  const { isFullscreen, toggleFullScreen } = useFullScreen();
  const [selectedKeys, setSelectedKeys] = useState('1');
  const navigate = useNavigate();
  const { tab } = useParams();
  // function to handle user logout
  const userLogout = async () => {
    try {
      const response = await ApiService.post('/api/v1/auth/logout');
      if (response?.result_code === 0) {
        removeSessionAndLogoutUser();
      } else {
        // notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
        removeSessionAndLogoutUser();
      }
    } catch (error) {
      // notificationWithIcon('error', 'ERROR', error?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
      removeSessionAndLogoutUser();
    }
  };

  const handleTabChange = (key) => {
    switch (key) {
      case '1': {
        navigate('/main/dashboard');
        break;
      }
      case '2': {
        navigate('/main/users');
        break;
      }
      case '3': {
        navigate('/main/hotels');
        break;
      }
      case '4': {
        navigate('/main/booking-orders');
        break;
      }
      case '5': {
        navigate('/main/profile');
        break;
      }
      case '8': {
        navigate('/main/flight-orders');
        break;
      }
      case '9': {
        navigate('/main/bus-orders');
        break;
      }
      case '10': {
        navigate('/main/car-orders');
        break;
      }
      case '11': {
        navigate('/main/train-orders');
        break;
      }
      case '6': {
        userLogout();
        break;
      }
      default: {
        navigate('/main/dashboard');
      }
    }
  };
  useEffect(() => {
    if (!tab) {
      navigate('/main/dashboard');
      setSelectedKeys('1');
    }
  }, [tab, navigate]);

  useEffect(() => {
    if (tab) {
      switch (tab) {
        case 'dashboard': {
          setSelectedKeys('1');
          break;
        }
        case 'users': {
          setSelectedKeys('2');
          break;
        }
        case 'hotels': {
          setSelectedKeys('3');
          break;
        }
        case 'booking-orders': {
          setSelectedKeys('4');
          break;
        }
        case 'profile': {
          setSelectedKeys('5');
          break;
        }
        case 'logout': {
          setSelectedKeys('6');
          break;
        }
        case 'rooms': {
          setSelectedKeys('7');
          break;
        }
        case 'flight-orders': {
          setSelectedKeys('8');
          break;
        }
        case 'bus-orders': {
          setSelectedKeys('9');
          break;
        }
        case 'car-orders': {
          setSelectedKeys('10');
          break;
        }
        case 'train-orders': {
          setSelectedKeys('11');
          break;
        }
        default: {
          navigate('/not-found');
        }
      }
    }
  }, [tab, navigate]);

  useEffect(() => {
    switch (selectedKeys) {
      case '1': {
        window.document.title = 'Tajde — Dashboard';
        break;
      }
      case '2': {
        window.document.title = 'Tajde — Users';
        break;
      }
      case '3': {
        window.document.title = 'Tajde — Hotels';
        break;
      }
      case '4': {
        window.document.title = 'Tajde — Booking Orders';
        break;
      }
      case '5': {
        window.document.title = 'Tajde — Profile';
        break;
      }
      case '6': {
        window.document.title = 'Tajde — Logout';
        break;
      }
      case '7': {
        window.document.title = 'Flight — Orders';
        break;
      }
      default: {
        window.document.title = 'Tajde — Dashboard';
      }
    }
  }, [selectedKeys]);

  return (
    <Layout className='w-full h-screen'>
      <Sider width={250} breakpoint='lg' collapsedWidth='0'>
        <UserBox />

        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[selectedKeys]}
          onClick={(e) => {
            handleTabChange(e.key);
          }}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Dashboard'
            },
            {
              key: '2',
              icon: <TeamOutlined />,
              label: 'Users'
            },
            {
              key: '3',
              icon: <HomeOutlined />,
              label: 'Hotels'
            },
            {
              key: '4',
              icon: <FileProtectOutlined />,
              label: 'Hotel Booking Orders'
            },
            {
              key: '8',
              icon: <RocketOutlined />,
              label: 'Flight Booking Orders'
            },
            {
              key: '9',
              icon: <InsertRowLeftOutlined />,
              label: 'Bus Booking Orders'
            },
            {
              key: '10',
              icon: <CarOutlined />,
              label: 'Car Booking Orders'
            },
            {
              key: '11',
              icon: <RadarChartOutlined />,
              label: 'Train Booking Orders'
            },
            {
              key: '5',
              icon: <UserOutlined />,
              label: 'My Profile'
            },
            {
              key: '6',
              icon: <LogoutOutlined />,
              label: 'Logout'
            }
          ]}
        />
      </Sider>

      <Layout>
        <Header className='p-0 !bg-bg-white'>
          <Link to='/'>
            <img
              className='w-[280px] h-[65px] mx-auto'
              alt='beach-resort-logo'
              src={Logo}
            />
          </Link>

          {/* full screen toggle button */}
          <Tooltip title='Click to toggle Full Screen' placement='left'>
            <Button
              className='absolute right-5 top-5'
              icon={isFullscreen ?
                (<FullscreenExitOutlined className='pb-12' />) :
                (<FullscreenOutlined className='pb-12' />)}
              onClick={toggleFullScreen}
              shape='default'
              type='default'
              size='middle'
            />
          </Tooltip>
        </Header>

        <Content className='bg-bg-white overflow-y-scroll m-2 p-2'>
          {selectedKeys === '1' && (<Dashboard />)}
          {selectedKeys === '2' && (<Users />)}
          {selectedKeys === '3' && (<Hotels />)}
          {selectedKeys === '4' && (<Orders />)}
          {selectedKeys === '5' && (<MyProfile />)}
          {selectedKeys === '7' && (<Rooms />)}
          {selectedKeys === '8' && (<FlightBookingHistory />)}
          {selectedKeys === '9' && (<BusBookingHistory />)}
          {selectedKeys === '10' && (<CarBookingHistory />)}
          {selectedKeys === '11' && (<TrainBookingHistory />)}
        </Content>

        <Footer className='text-center font-text-font font-medium '>
          ©2025 Tajde — Powerd By
          {' '}
          <a
            className='text-color-primary hover:text-color-secondary'
            href='https://riveyrainfotech.com/'
            target='_blank'
            rel='noreferrer'
          >
            Riveyra Infotech Pvt Ltd
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default React.memo(Main);
