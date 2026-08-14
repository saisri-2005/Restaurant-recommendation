// src/components/CardItem.js
import React from 'react';
import { Card, Col } from 'react-bootstrap';

const CardItem = ({ restaurant }) => (
  <Col md={4} className="mb-3">
    <Card>
      <Card.Body>
        <Card.Title>{restaurant.name}</Card.Title>
        <Card.Text>
          Cuisines: {restaurant.cuisine.join(', ')} <br />
          Location: {restaurant.location} <br />
          Rating: {restaurant.rating}
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

export default CardItem;