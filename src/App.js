import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Login from "./components/auth/login";

// import Header from "./components/header";

import SeatReservation from "./components/childpage_1/seat-reservation"; // Ensure the correct path
import SeatDetails from "./components/childpage_1/seat-details"; // Ensure the correct path and filename

import TicketPrices from './components/childpage_1/Ticket-prices';
import { AuthProvider } from "./contexts/authContext";
import CenterDetails from './components/childpage_1/center-details';
import TimeShedule from './components/childpage_1/time-shedule';
import Details from './components/childpage_1/Details';
import Lostandfound from './components/childpage_1/lost-found';
import About from './components/childpage_1/about';
import Dashboard from './components/home/Dashboard';
import Notification from './components/childpage_1/Notification';
import StudentDetails from './components/childpage_1/student-details';
import DriverDetails from './components/childpage_1/Driver-info';
import BusInformation from'./components/childpage_1/Bus-info';
import BusLocation from './components/childpage_1/Bus-location';



function App() {
  const routesArray = [
    {
      path: "/login",
      element: <Login />,
    },
  
    
    {
      path: "/Home",
      element:   <Dashboard/>,
    },
    {
      path: "/childpage_1/seat-reservation",
      element: <SeatReservation />,
    },
    {
      path: "/childpage_1/seat-details/:seatNumber", // Dynamic segment to capture seatNumber
      element: <SeatDetails />,
    },
    {
      path: "/childpage_1/center-details",
      element: <CenterDetails />,
    },
    {
      path: "/childpage_1/Ticket-prices",
      element: <TicketPrices />,
    },
    {
      path: "/childpage_1/time-schedule",
      element: <TimeShedule />,
    },
    {
      path: "/childpage_1/Details",
      element: <Details/>,
    },
    {
      path: "/childpage_1/lost-found",
      element: <Lostandfound/>,
    },
    {
      path: "/childpage_1/about",
      element: <About />,
    },
    {
      path: "/childpage_1/Notification",
      element: <Notification/>,
    },
    {
      path: "/childpage_1/student-details",
      element: <  StudentDetails/>,
    },
    {
      path: "/childpage_1/Driver-info",
      element: <  DriverDetails/>,
    },
    {
      path:"/childpage_1/Bus-info",
      element:<BusInformation/>
    },
    {
      path:"/childpage_1/Bus-location",
      element:<BusLocation/>
    },
  

  
  

  

  
  

  
  
  
  
  
    
    
    // {
    //   path: "/childpages/live-sheduling",
    //   element: <LiveScheduling />,
    // },
    // {
    //   path: "/childpages/ticket-prices",
    //   element: <TicketPrices />,
    // }
    {
      path: "/",
      element: <Navigate to="/login" />, // Redirect to login
    },
  ];

  let routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      {/* <Header /> */}
      <div className="w-full h-screen flex flex-col">
        {routesElement}
      </div>
    </AuthProvider>
  );
}

export default App;
