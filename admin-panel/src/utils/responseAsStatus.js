/**
 * @author Rohit Kumar
 */

export const userStatusAsResponse = (status) => {
  console.log(status);
  if (status === 1) {
    return {
      color: '#108ee9',
      level: 'REGISTER'
    };
  }
  if (status === 2) {
    return {
      color: '#87d068',
      level: 'LOGIN'
    };
  }
  if (status === 3) {
    return {
      color: '#2db7f5',
      level: 'LOGOUT'
    };
  }
  if (status === 4) {
    return {
      color: '#f55000',
      level: 'BLOCKED'
    };
  }
  return {
    color: 'default',
    level: 'UNKNOWN'
  };
};

export const roomStatusAsResponse = (status) => {
  if (status === 'available') {
    return {
      color: '#87d068',
      level: 'AVAILABLE'
    };
  }
  if (status === 'unavailable') {
    return {
      color: '#f55000',
      level: 'UNAVAILABLE'
    };
  }
  if (status === 'booked') {
    return {
      color: '#2db7f5',
      level: 'BOOKED'
    };
  }
  return {
    color: 'default',
    level: 'UNKNOWN'
  };
};

export const roomTypeAsColor = (type) => {
  if (type === 'single') {
    return 'purple';
  }
  if (type === 'couple') {
    return 'magenta';
  }
  if (type === 'family') {
    return 'volcano';
  }
  if (type === 'presidential') {
    return 'geekblue';
  }
  return 'default';
};

export const bookingStatusAsResponse = (status) => {
  console.log(status);
  
  if (status === 'pending') {
    return {
      color: 'blue',
      level: 'PENDING'
    };
  }
  if (status === 'cancel') {
    return {
      color: 'volcano',
      level: 'CANCEL'
    };
  }
  if (status === 'confirmed') {
    return {
      color: 'lime',
      level: 'CONFIRMED'
    };
  }
  if (status === 'rejected') {
    return {
      color: 'red',
      level: 'REJECTED'
    };
  }
  if (status === 'in-reviews') {
    return {
      color: 'purple',
      level: 'IN REVIEWS'
    };
  }
  if (status === 'completed') {
    return {
      color: 'green',
      level: 'COMPLETED'
    };
  }
  return {
    color: 'default',
    level: 'UNKNOWN'
  };
};
