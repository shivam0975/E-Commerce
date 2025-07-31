import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer(){
  return (
    <footer>
      <Container className="text-center py-3">
        &copy; {new Date().getFullYear()} Shivam's E-Shop. All rights reserved.
      </Container>
    </footer>
  );
}