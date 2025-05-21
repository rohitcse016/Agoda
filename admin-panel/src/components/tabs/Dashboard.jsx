/**
 * @author Rohit Kumar
 */

import { Result } from 'antd';
import React from 'react';
import useFetchData from '../../hooks/useFetchData';
import BookingCard from '../dashboard/BookingCard';
import UsersCard from '../dashboard/UsersCard';

function Dashboard() {
  // fetch dashboard API data
  const [loading, error, response] = useFetchData('/dashboard');

  return (
    <div>
      <h2 className='text-[20px] text-center font-text-font font-medium py-4'>
        Welcome to Tajde — Dashboard
      </h2>

      {error ? (
        <Result
          title='Failed to fetch'
          subTitle={error}
          status='error'
        />
      ) : (
        <div className='flex flex-row flex-wrap items-center justify-between gap-2'>
          <UsersCard
            loading={loading}
            data={response}
          />

          {/* <RoomCard
            loading={loading}
            data={response}
          /> */}

          <BookingCard
            loading={loading}
            data={response}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(Dashboard);
