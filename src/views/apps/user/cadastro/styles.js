import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  display: grid;
  max-width: 80%;

`;

export const Imagem = styled.div`
  align-self: center;
  margin-bottom: 30px;
  label {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
    /* img {
      height: 120px;
      width: 120px;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.3);
      background: #eee;
    } */
    /* .foto {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-top: 25px;
      height: 120px;
      width: 120px;
      border-radius: 50%;
      border: 2px dashed rgba(0, 0, 0, 0.15);
      background: #fff;
      color: rgba(0, 0, 0, 0.15);
    } */
    .nome {
      display: inline-block;
      font-size: 2.0em;
      width: 3.5em;
      height: 3.5em;
      line-height: 3.5em;
      text-align: center;
      border-radius: 50%;
      background: plum;
      vertical-align: middle;
      margin-right: 1em;
      color: white;
    }
    input {
      display: none;
    }
  }
`;

