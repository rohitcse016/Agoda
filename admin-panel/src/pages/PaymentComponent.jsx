import React from 'react';
import { useRazorpay } from 'react-razorpay';

const PaymentComponent = () => {
  const Razorpay = useRazorpay();

     const handlePayment = async () => {

        const order = "order_9AXWu170gUtm";//await createOrder(params); //  Create order on your backend

        const options = {
            key: "rzp_test_UmUIzzSAIdrrTV", // Enter the Key ID generated from the Dashboard
            amount: parseInt(10) * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: 'candidateDetails?.firstName + " " + candidateDetails?.lastName',
            description: `Room name: `,
            image: "https://example.com/your_logo",
            // order_id: order, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
            handler: function (response) {
                // alert(JSON.stringify(response));
                // onSubmitBooking()
            },
            prefill: {
                name: 'candidateDetails?.firstName + " " + candidateDetails?.lastName',
                email: 'candidateDetails?.emailID',
                contact: 'candidateDetails?.mobileNo',
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response) {
            alert(JSON.stringify(response, null, 1));
        });

        rzp1.open();
        
    };
  return (
    <button onClick={()=>handlePayment("")}>Pay Now</button>
  );
};

export default PaymentComponent;
