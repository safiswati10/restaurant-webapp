import React, { useEffect, useState } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  ProgressBar, 
  Alert, 
  Spinner,
  Button
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const TrackOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get restaurant details from location state
  const restaurantId = location.state?.restaurantId;
  const restaurantName = location.state?.restaurantName || "Restaurant";

  // Default order data structure
  const defaultOrder = {
    id: "123456",
    restaurantName,
    restaurantId,
    items: [
      { name: "Chicken Shawarma", quantity: 2, price: 250 },
      { name: "Mango Shake", quantity: 1, price: 220 },
    ],
    subtotal: 720,
    serviceFee: 50,
    deliveryFee: 0,
    tip: 0,
    total: 770,
    timeline: [
      { step: "Order Placed", completed: true },
      { step: "Preparing", completed: false },
      { step: "Out for Delivery", completed: false },
      { step: "Delivered", completed: false },
    ],
  };

  useEffect(() => {
    try {
      // Check for order data in location state first
      if (location.state?.order) {
        setOrder({
          ...defaultOrder,
          ...location.state.order,
          restaurantId,
          restaurantName,
          timeline: location.state.order.timeline || defaultOrder.timeline
        });
        // Save to localStorage for persistence
        localStorage.setItem('currentOrder', JSON.stringify({
          ...defaultOrder,
          ...location.state.order,
          restaurantId,
          restaurantName,
          timeline: location.state.order.timeline || defaultOrder.timeline
        }));
      } else {
        // Fallback: Check localStorage for recent order
        const savedOrder = localStorage.getItem('currentOrder');
        if (savedOrder) {
          const parsedOrder = JSON.parse(savedOrder);
          setOrder({
            ...defaultOrder,
            ...parsedOrder,
            restaurantId: parsedOrder.restaurantId || restaurantId,
            restaurantName: parsedOrder.restaurantName || restaurantName,
            timeline: parsedOrder.timeline || defaultOrder.timeline
          });
        } else {
          // Final fallback to default data
          setOrder({
            ...defaultOrder,
            restaurantId,
            restaurantName
          });
        }
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load order details");
      setLoading(false);
    }
  }, [location.state]);

  // Simulate order progress updates
  useEffect(() => {
    if (!order || !order.timeline) return;

    const timer = setInterval(() => {
      setOrder(prevOrder => {
        if (!prevOrder || !prevOrder.timeline) return prevOrder;
        
        const newTimeline = [...prevOrder.timeline];
        const nextStepIndex = newTimeline.findIndex(step => !step.completed);
        
        if (nextStepIndex !== -1) {
          newTimeline[nextStepIndex].completed = true;
          const updatedOrder = { ...prevOrder, timeline: newTimeline };
          localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
          return updatedOrder;
        }
        return prevOrder;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, [order]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" style={{ color: "#FA8C16" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading your order details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}
          <Button 
            style={{ backgroundColor: "#FA8C16", borderColor: "#FA8C16" }}
            className="mt-3"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!order || !order.timeline) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          No order details available
          <Button 
            style={{ backgroundColor: "#FA8C16", borderColor: "#FA8C16" }}
            className="mt-3"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  // Calculate progress percentage based on completed steps
  const completedSteps = order.timeline.filter((step) => step.completed).length;
  const totalSteps = order.timeline.length;
  const progress = (completedSteps / totalSteps) * 100;

  // Determine the current status based on progress
  const currentStatus = order.timeline[completedSteps]?.step || "Order Placed";

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#FA8C16" }}>
        Track Your Order
      </h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              {/* Order ID */}
              <h4 className="fw-bold mb-4" style={{ color: "#FA8C16" }}>
                Order #{order.id}
              </h4>

              {/* Restaurant Name */}
              <div className="mb-3">
                <h5 className="fw-semibold">Restaurant:</h5>
                <p className="fw-bold">{order.restaurantName}</p>
              </div>

              {/* Order Status */}
              <div className="mb-4">
                <h5 className="fw-semibold">Current Status:</h5>
                <p
                  className="fw-bold"
                  style={{
                    color: currentStatus === "Delivered" ? "#28a745" : "#FA8C16",
                  }}
                >
                  {currentStatus}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <ProgressBar
                  now={progress}
                  label={`${Math.round(progress)}%`}
                  style={{ 
                    height: "10px", 
                    borderRadius: "5px",
                    backgroundColor: "#f0f0f0"
                  }}
                >
                  <ProgressBar 
                    now={progress} 
                    style={{ backgroundColor: "#FA8C16" }} 
                  />
                </ProgressBar>
                <div className="d-flex justify-content-between mt-2">
                  {order.timeline.map((step, index) => (
                    <div 
                      key={index} 
                      className={`text-center ${step.completed ? 'text-success' : 'text-muted'}`}
                      style={{ flex: 1 }}
                    >
                      <small>{step.step}</small>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <Card
                className="mb-4"
                style={{
                  border: "none",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                  padding: "1.5rem",
                }}
              >
                <Card.Header className="fw-bold" style={{ backgroundColor: "#FA8C16", color: "#fff" }}>
                  Order Summary
                </Card.Header>
                <Card.Body>
                  {/* Restaurant Name */}
                  <h5 className="fw-bold mb-3">{order.restaurantName}</h5>

                  {/* Order Items */}
                  {order.items.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between mb-2">
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                  <hr />

                  {/* Subtotal */}
                  <div className="d-flex justify-content-between">
                    <span>Subtotal:</span>
                    <span>Rs. {order.subtotal}</span>
                  </div>

                  {/* Service Fee */}
                  <div className="d-flex justify-content-between">
                    <span>Service Fee:</span>
                    <span>Rs. {order.serviceFee}</span>
                  </div>

                  {/* Delivery Fee */}
                  <div className="d-flex justify-content-between">
                    <span>Delivery Fee:</span>
                    <span>Rs. {order.deliveryFee}</span>
                  </div>

                  {/* Tip */}
                  <div className="d-flex justify-content-between">
                    <span>Tip:</span>
                    <span>Rs. {order.tip}</span>
                  </div>

                  {/* Total */}
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total (incl. fees and tax):</span>
                    <span>Rs. {order.total}</span>
                  </div>
                </Card.Body>
              </Card>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <Button 
                  variant="outline-warning"
                  style={{ 
                    color: "#FA8C16", 
                    borderColor: "#FA8C16",
                    backgroundColor: "white"
                  }}
                  onClick={() => navigate(`/restaurant/${order.restaurantId}/${order.restaurantName.replace(/\s+/g, '-').toLowerCase()}`)}
                >
                  Order Again
                </Button>
                <Button 
                  style={{ 
                    backgroundColor: "#FA8C16", 
                    borderColor: "#FA8C16",
                    color: "white"
                  }}
                  onClick={() => navigate('/contact')}
                >
                  Need Help?
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TrackOrderPage;