import React from "react";
import styled from "styled-components";

export default function Signature() {
  return (
    <SignContainer>
      <p className="signature">@gbenimako</p>
    </SignContainer>
  );
}

const SignContainer = styled.div`
  position: sticky;
  right: 3px;
  bottom: 0px;
  padding: 1px 3px;
  text-shadow: -1px -1px 0px rgba(255, 255, 255, 0.3),
    1px 1px 0px rgba(0, 0, 0, 0.8);
  color: #333;
  opacity: 0.4;
`;
