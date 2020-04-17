import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  display: grid;
  max-width: 100%;
  .nome {
    display: inline-block;
    font-size: .7em;
    width: 1.5em;
    height: 1.5em;
    line-height: 1.5em;
    text-align: center;
    border-radius: 50%;
    background: plum;
    vertical-align: middle;
    color: white;
  }
`;

